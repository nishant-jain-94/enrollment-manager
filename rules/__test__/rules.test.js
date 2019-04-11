require('should');
const courseActivator = require('../enrollment-rules');

describe('Rules', () => {
  test('Should Tag User with SBA if has overallScore greaterThan 70', async () => {
    const user = {
      overallScore: 70,
    };
    const events = await courseActivator.run(user);
    events.should.be.an.Array();
    events.length.should.be.exactly(1);
    events[0].should.have.property('type');
    events[0].type.should.be.exactly('SBA');
  });

  test('Answer what courses Abhijeet would be enrolled into', async () => {
    const user = {
      overallScore: 58,
      uiLayer: 65,
      mwLayer: 54,
      lgLayer: 63,
    };
    const events = await courseActivator.run(user);
    console.log(events);
  });
});
