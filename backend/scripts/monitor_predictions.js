/**
 * Monitoring script for prediction logs
 * Run this periodically (e.g., daily/weekly) to check for:
 * - Distribution drift
 * - Confidence degradation
 * - Potential biases
 *
 * Usage: node backend/scripts/monitor_predictions.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PredictionLog = require("../models/PredictionLog");

dotenv.config({ path: "./backend/.env" });

async function monitorPredictions() {
  try {
    console.log("=" * 70);
    console.log("Prediction Monitoring Report");
    console.log(`Generated: ${new Date().toISOString()}`);
    console.log("=" * 70);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("\nConnected to MongoDB");

    // Get time ranges
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // Get total prediction counts
    const total = await PredictionLog.countDocuments();
    const count24h = await PredictionLog.countDocuments({ timestamp: { $gte: last24h } });
    const count7d = await PredictionLog.countDocuments({ timestamp: { $gte: last7d } });
    const count30d = await PredictionLog.countDocuments({ timestamp: { $gte: last30d } });

    console.log("\n[1/4] Volume Statistics:");
    console.log(`   Total predictions: ${total}`);
    console.log(`   Last 24 hours: ${count24h}`);
    console.log(`   Last 7 days: ${count7d}`);
    console.log(`   Last 30 days: ${count30d}`);

    if (count7d === 0) {
      console.log("\nNo recent predictions to analyze. Exiting.");
      await mongoose.disconnect();
      return;
    }

    // Analyze recent predictions (last 7 days)
    const recentPredictions = await PredictionLog.find({
      timestamp: { $gte: last7d }
    }).lean();

    // Career distribution
    const careerDist = {};
    recentPredictions.forEach(pred => {
      const career = pred.predictedCareer.main;
      careerDist[career] = (careerDist[career] || 0) + 1;
    });

    console.log("\n[2/4] Career Distribution (Last 7 days):");
    const sortedCareers = Object.entries(careerDist)
      .sort((a, b) => b[1] - a[1]);

    sortedCareers.forEach(([career, count]) => {
      const pct = (count / recentPredictions.length * 100).toFixed(1);
      console.log(`   ${career.padEnd(40)} ${count.toString().padStart(5)} (${pct}%)`);
    });

    // Confidence analysis
    const confidences = recentPredictions.map(p => p.confidence);
    const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
    const lowConfCount = recentPredictions.filter(p => p.lowConfidence).length;

    console.log("\n[3/4] Confidence Analysis:");
    console.log(`   Average confidence: ${avgConfidence.toFixed(3)}`);
    console.log(`   Low confidence predictions: ${lowConfCount} (${(lowConfCount / recentPredictions.length * 100).toFixed(1)}%)`);

    // Check for anomalies
    console.log("\n[4/4] Anomaly Detection:");
    const anomalies = [];

    // Check if any career is over-represented (>40%)
    sortedCareers.forEach(([career, count]) => {
      const pct = count / recentPredictions.length;
      if (pct > 0.4) {
        anomalies.push({
          type: "Over-representation",
          career,
          value: `${(pct * 100).toFixed(1)}%`,
          severity: "HIGH"
        });
      }
    });

    // Check if average confidence is declining
    if (avgConfidence < 0.75) {
      anomalies.push({
        type: "Low confidence",
        career: "Overall",
        value: avgConfidence.toFixed(3),
        severity: "MEDIUM"
      });
    }

    // Check if too many low confidence predictions
    if (lowConfCount / recentPredictions.length > 0.3) {
      anomalies.push({
        type: "High low-confidence rate",
        career: "Overall",
        value: `${(lowConfCount / recentPredictions.length * 100).toFixed(1)}%`,
        severity: "MEDIUM"
      });
    }

    if (anomalies.length > 0) {
      console.log("   Anomalies detected:");
      anomalies.forEach((anomaly, idx) => {
        console.log(`\n   [${idx + 1}] ${anomaly.type} - ${anomaly.severity}`);
        console.log(`       Career: ${anomaly.career}`);
        console.log(`       Value: ${anomaly.value}`);
      });

      console.log("\n   RECOMMENDATIONS:");
      console.log("   - Review recent predictions for patterns");
      console.log("   - Check if training data needs updating");
      console.log("   - Run bias audit: python ml/src/bias_audit.py");
      console.log("   - Gather user feedback on prediction quality");
    } else {
      console.log("   No anomalies detected.");
    }

    console.log("\n" + "=" * 70);
    console.log("Monitoring complete!");
    console.log("=" * 70);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error monitoring predictions:", error);
    process.exit(1);
  }
}

// Run monitoring
monitorPredictions();
