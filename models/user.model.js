const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  associateId: String,
  name: String,
  batch: String,
  emailId: String,
  stack: String,
  calendar: String,
  overallScore: Number,
  uiLayer: Number,
  mwLayer: Number,
  lgLayer: Number,
  eligibleModules: [String],
  eligibleModuleTypes: [String],
  enrolledEvents: Array,
});

userSchema.virtual('Associate ID').set(function associateIdSetter(value) {
  this.associateId = value;
});

userSchema.virtual('Name').set(function nameSetter(value) {
  this.name = value;
});

userSchema.virtual('Batch').set(function batchSetter(value) {
  this.batch = value;
});

userSchema.virtual('Overall Score').set(function overallScoreSetter(value) {
  this.overallScore = +value.slice(0, -1);
});

userSchema.virtual('UI Layer').set(function uiLayerSetter(value) {
  this.uiLayer = +value.slice(0, -1);
});

userSchema.virtual('MW Layer').set(function mwLayerSetter(value) {
  this.mwLayer = +value.slice(0, -1);
});

userSchema.virtual('Lg Layer').set(function lgLayerSetter(value) {
  this.lgLayer = +value.slice(0, -1);
});

userSchema.virtual('Stack').set(function stackSetter(value) {
  this.stack = value;
});

userSchema.statics.enrollUsers = async function enrollUsers(users) {
  const insertedDocs = await this.insertMany(users);
  return insertedDocs;
};

userSchema.statics.enrollUserToEvent = async function enrollUserToEvent(associateId, event) {
  const updatedDoc = await this.updateOne(
    { associateId },
    { $push: { enrolledEvents: event } },
    { new: true },
  );
  return updatedDoc;
};

userSchema.statics.getEnrolledEvents = async function getEnrolledEvents(associateId) {
  const enrolledEvents = await this.findOne({ associateId }).select('enrolledEvents').exec();
  return enrolledEvents;
};

module.exports = mongoose.model('users', userSchema);
