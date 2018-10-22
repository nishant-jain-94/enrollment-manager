const mongoose = require('mongoose');

class User {
  static async findOne() {
    return {
      associateId: '42323',
      name: 'Test',
    };
  }
  static async enrollUsers(users) {
    return users.map(user => (
      { ...user, _id: new mongoose.Types.ObjectId() }));
  }
}

module.exports = User;
