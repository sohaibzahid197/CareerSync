const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true
  },
  score: {
    type: String,  // Updated to store score as a string
    required: true
  }
});

const testResultSchema = new mongoose.Schema({
  candidateEmail: {
    type: String,
    required: true,
    unique: true  // Ensure a single document per candidate
  },
  tests: [testSchema]  // Array of tests
});

module.exports = mongoose.model('TestResult', testResultSchema);
