const { Engine } = require('json-rules-engine');

const overallScoreBetween40And70 = {
  all: [
    {
      fact: 'overallScore',
      operator: 'greaterThanInclusive',
      value: 40,
    },
    {
      fact: 'overallScore',
      operator: 'lessThan',
      value: 70,
    },
  ],
};

const uiScoreBetween60And70 = {
  all: [
    {
      fact: 'uiLayer',
      operator: 'greaterThanInclusive',
      value: 60,
    },
    {
      fact: 'uiLayer',
      operator: 'lessThan',
      value: 70,
    },
  ],
};

const mwScoreBetween60And70 = {
  all: [
    {
      fact: 'mwLayer',
      operator: 'greaterThanInclusive',
      value: 60,
    },
    {
      fact: 'mwLayer',
      operator: 'lessThan',
      value: 70,
    },
  ],
};

const MW_MICRO_CREDENTIALLING = {
  conditions: {
    any: [
      {
        all: [
          overallScoreBetween40And70,
          {
            fact: 'uiLayer',
            operator: 'greaterThanInclusive',
            value: 60,
          },
          {
            fact: 'mwLayer',
            operator: 'lessThan',
            value: 60,
          },
        ],
      },
      {
        all: [
          overallScoreBetween40And70,
          {
            any: [
              uiScoreBetween60And70,
              mwScoreBetween60And70,
            ],
          },
          {
            fact: 'mwLayer',
            operator: 'lessThan',
            value: {
              fact: 'uiLayer',
            },
          },
        ],
      },
    ],
  },
  event: {
    type: 'MW_MICRO_CREDENTIALLING',
  },
};

const conditionsForCapsuleOrSBA = {
  conditions: {
    all: [
      overallScoreBetween40And70,
      {
        fact: 'uiLayer',
        operator: 'greaterThanInclusive',
        value: 70,
      },
      {
        fact: 'mwLayer',
        operator: 'greaterThanInclusive',
        value: 70,
      },
    ],
  },
};

const CAPSULE = {
  ...conditionsForCapsuleOrSBA,
  event: {
    type: 'CAPSULE',
  },
};

const SBA = {
  ...conditionsForCapsuleOrSBA,
  event: {
    type: 'SBA',
  },
};

const UI_MICRO_CREDENTIALLING = {
  conditions: {
    any: [
      {
        all: [
          overallScoreBetween40And70,
          {
            any: [
              uiScoreBetween60And70,
              mwScoreBetween60And70,
            ],
          },
          {
            fact: 'mwLayer',
            operator: 'greaterThan',
            value: {
              fact: 'uiLayer',
            },
          },
        ],
      },
      {
        all: [
          overallScoreBetween40And70,
          {
            fact: 'uiLayer',
            operator: 'lessThan',
            value: 60,
          },
          {
            fact: 'mwLayer',
            operator: 'greaterThanInclusive',
            value: 60,
          },
        ],
      },
    ],
  },
  event: {
    type: 'MW_MICRO_CREDENTIALLING',
  },
};

const FSD_EXPRESS = {
  conditions: {
    all: [
      overallScoreBetween40And70,
      {
        fact: 'uiLayer',
        operator: 'lessThan',
        value: 60,
      },
      {
        fact: 'mwLayer',
        operator: 'lessThan',
        value: 60,
      },
      {
        fact: 'lgLayer',
        operator: 'greaterThanInclusive',
        value: 60,
      },
    ],
  },
  event: {
    type: 'FSD_EXPRESS',
  },
};

const FSD_COMPLETE = {
  conditions: {
    all: [
      overallScoreBetween40And70,
      {
        fact: 'uiLayer',
        operator: 'lessThan',
        value: 60,
      },
      {
        fact: 'mwLayer',
        operator: 'lessThan',
        value: 60,
      },
      {
        fact: 'lgLayer',
        operator: 'lessThan',
        value: 60,
      },
    ],
  },
  event: {
    type: 'FSD_COMPLETE',
  },
};

const DIRECT_SBA = {
  conditions: {
    all: [{
      fact: 'overallScore',
      operator: 'greaterThanInclusive',
      value: 70,
    }],
  },
  event: {
    type: 'SBA',
  },
};

const TAKE_RELEVANT_COURSE = {
  conditions: {
    all: [{
      fact: 'overallScore',
      operator: 'lessThan',
      value: 40,
    }],
  },
  event: {
    type: 'TAKE_RELEVANT_COURSE',
  },
};

const engine = new Engine();
engine.addRule(TAKE_RELEVANT_COURSE);
engine.addRule(MW_MICRO_CREDENTIALLING);
engine.addRule(CAPSULE);
engine.addRule(SBA);
engine.addRule(DIRECT_SBA);
engine.addRule(UI_MICRO_CREDENTIALLING);
engine.addRule(FSD_COMPLETE);
engine.addRule(FSD_EXPRESS);

engine.addFact('overallScore', params => params.overallScore);
engine.addFact('uiLayer', params => params.uiLayer);
engine.addFact('mwLayer', params => params.mwLayer);
engine.addFact('lgLayer', params => params.lgLayer);

module.exports = engine;
