import SetYourGoalsThumbnail from './elementThumbnails/set_your_goals.png';
import MonthlyActiveUsersThumbnail from './elementThumbnails/monthly_active_users.png';
import DesignThumbnail from './elementThumbnails/design.png';
import ReferralTrafficThumbnail from './elementThumbnails/referral_traffic.png';
import AnalysisThumbnail from './elementThumbnails/analysis.png';
import MarketConditionsThumbnail from './elementThumbnails/market_conditions.png';
import AdditionalUnitsThumbnail from './elementThumbnails/additional_units.png';
import QuoteThumbnail from './elementThumbnails/quote.png';

import { BorderStyle } from 'widgets/BasicShapeWidget/BasicShapeWidget.types';

// TODO - this should probably be stored in the DB instead of hardcode
// Default data for the styled widgets in the Elements category
export const STYLED_RESPONSIVE_TEXT_WIDGETS = [
  // set your goals
  {
    widthPx: 322,
    heightPx: 176.77,
    backgroundShapeData: {
      fillColor: ['rgba(2, 152, 166, 0.13)'],
      border: {
        color: '#0298A6',
        width: 5,
        style: BorderStyle.Solid,
      },
    },
    textWidgetData: {
      widthPx: 282,
      heightPx: 137,
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'bold',
                  },
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Karla',
                      fontSize: '18px',
                      color: '#2B2B35',
                    },
                  },
                ],
                text: 'Set your goals',
              },
            ],
          },
          {
            type: 'title',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Karla',
                      fontSize: '14px',
                      color: '#2B2B35',
                    },
                  },
                ],
                text: "Setting goals is an important part of success. It's not just about having a vague idea that you want to be healthy, fit, or whatever. If you're going to achieve your goals, you need to make them specific and measurable.",
              },
            ],
          },
        ],
      },
    },
    fontsToLoad: ['Karla'],
    thumbnail: {
      src: SetYourGoalsThumbnail,
      altText: 'Set your goals thumbnail',
    },
  },
  // 1.3 million users
  {
    widthPx: 244,
    heightPx: 217.59,
    backgroundShapeData: {
      fillColor: ['#7DC6EA'],
      border: {
        color: '#fff',
        width: 5,
        style: BorderStyle.Solid,
      },
    },
    textWidgetData: {
      widthPx: 204,
      heightPx: 177.59,
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Courier New',
                      fontSize: '15px',
                      color: '#1A4C7A',
                    },
                  },
                ],
                text: 'Our company has attracted more than',
              },
            ],
          },
          {
            type: 'title',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'bold',
                  },
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Montserrat',
                      fontSize: '49px',
                      color: '#1A4C7A',
                    },
                  },
                ],
                text: '1.3 Million',
              },
            ],
          },
          {
            type: 'title',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Courier New',
                      fontSize: '15px',
                      color: '#1A4C7A',
                    },
                  },
                ],
                text: 'Monthly Active Users',
              },
            ],
          },
        ],
      },
    },
    fontsToLoad: ['Courier New', 'Montserrat'],
    thumbnail: {
      src: MonthlyActiveUsersThumbnail,
      altText: '1.3 Million users',
    },
  },
  // design button
  {
    widthPx: 157,
    heightPx: 64,
    backgroundShapeData: {
      fillColor: ['#003F7F'],
      cornerRadius: 10,
      border: {
        color: 'rgba(0,0,0,0)',
        width: 0,
        style: BorderStyle.Solid,
      },
    },
    textWidgetData: {
      widthPx: 117,
      heightPx: 24,
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'center',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'bold',
                  },
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Rubik',
                      fontSize: '20px',
                      color: '#fff',
                    },
                  },
                ],
                text: 'Design',
              },
            ],
          },
        ],
      },
    },
    fontsToLoad: ['Rubik'],
    thumbnail: {
      src: DesignThumbnail,
      altText: 'Design button',
    },
  },
  // +25.5%
  {
    widthPx: 189,
    heightPx: 108,
    backgroundShapeData: {
      fillColor: ['#4FC6FF'],
      cornerRadius: 10,
      border: {
        color: 'rgba(0,0,0,0)',
        width: 0,
        style: BorderStyle.Solid,
      },
    },
    textWidgetData: {
      widthPx: 149,
      heightPx: 68.39,
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'center',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Vidaloka',
                      fontSize: '40px',
                      color: '#2B2B35',
                    },
                  },
                ],
                text: '+25.5%',
              },
            ],
          },
          {
            type: 'title',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'center',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'bold',
                  },
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Inter',
                      fontSize: '17px',
                      color: '#2B2B35',
                    },
                  },
                ],
                text: 'Referral Traffic',
              },
            ],
          },
        ],
      },
    },
    fontsToLoad: ['Vidaloka'],
    thumbnail: {
      src: ReferralTrafficThumbnail,
      altText: '25.5% of people',
    },
  },
  // Analysis
  {
    widthPx: 350,
    heightPx: 179.13,
    backgroundShapeData: {
      fillColor: ['#FFC72D'],
      border: {
        color: '#fff',
        width: 5,
        style: BorderStyle.Solid,
      },
    },
    textWidgetData: {
      widthPx: 310,
      heightPx: 139.13,
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'center',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'bold',
                  },
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Maven Pro',
                      fontSize: '20px',
                      color: '#2B2B35',
                    },
                  },
                ],
                text: 'Analysis',
              },
            ],
          },
          {
            type: 'paragraph',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'center',
            },
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      lineHeight: '1.2',
                      textAlign: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'textStyle',
                            attrs: {
                              fontFamily: 'Maven Pro',
                              fontSize: '15px',
                              color: '#2B2B35',
                            },
                          },
                        ],
                        text: 'Enhance employee’s performance, productivity and creativity',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      lineHeight: '1.2',
                      textAlign: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'textStyle',
                            attrs: {
                              fontFamily: 'Maven Pro',
                              fontSize: '15px',
                              color: '#2B2B35',
                            },
                          },
                        ],
                        text: 'Improve business outcomes',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      lineHeight: '1.2',
                      textAlign: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'textStyle',
                            attrs: {
                              fontFamily: 'Maven Pro',
                              fontSize: '15px',
                              color: '#2B2B35',
                            },
                          },
                        ],
                        text: 'Experience level: new team members',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      lineHeight: '1.2',
                      textAlign: 'left',
                    },
                    content: [
                      {
                        type: 'text',
                        marks: [
                          {
                            type: 'textStyle',
                            attrs: {
                              fontFamily: 'Maven Pro',
                              fontSize: '15px',
                              color: '#2B2B35',
                            },
                          },
                        ],
                        text: 'Update inventory of existing content',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    fontsToLoad: ['Maven Pro'],
    thumbnail: {
      src: AnalysisThumbnail,
      altText: 'Analysis',
    },
  },
  // Market Conditions
  {
    widthPx: 242,
    heightPx: 366.33,
    backgroundShapeData: {
      fillColor: ['#FAFFE4'],
      border: {
        color: '#000',
        width: 2,
        style: BorderStyle.Solid,
      },
    },
    textWidgetData: {
      widthPx: 202,
      heightPx: 326.33,
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'bold',
                  },
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Merriweather',
                      fontSize: '24px',
                      color: '#000',
                    },
                  },
                ],
                text: 'MARKET CONDITIONS',
              },
            ],
          },
          {
            type: 'title',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
          },
          {
            type: 'title',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Raleway',
                      fontSize: '15px',
                      color: '#000',
                    },
                  },
                ],
                text: 'The market cannot be fully predicted, especially in ones that rapidly grow. Keeping up with the market requires consistent research',
              },
            ],
          },
          {
            type: 'title',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'left',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Raleway',
                      fontSize: '15px',
                      color: '#000',
                    },
                  },
                ],
                text: 'and development to ensure that changes in strategies or visions are dutifully implemented. Further, aspects such as inflation or the cost of capital would have to be forecasted with uncertainties.',
              },
            ],
          },
        ],
      },
    },
    fontsToLoad: ['Raleway', 'Merriweather'],
    thumbnail: {
      src: MarketConditionsThumbnail,
      altText: 'Market conditions',
    },
  },
  // Additional units
  {
    widthPx: 351,
    heightPx: 113.2,
    backgroundShapeData: {
      fillColor: ['#fff'],
      cornerRadius: 10,
      border: {
        color: '#DB654E',
        width: 5,
        style: BorderStyle.Solid,
      },
    },
    textWidgetData: {
      widthPx: 311,
      heightPx: 73.2,
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'center',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Libre Franklin',
                      fontSize: '15px',
                      color: '#2B2B35',
                    },
                  },
                ],
                text: 'Additional units sold since last month',
              },
            ],
          },
          {
            type: 'title',
            attrs: {
              lineHeight: '1.2',
              textAlign: 'center',
            },
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'bold',
                  },
                  {
                    type: 'textStyle',
                    attrs: {
                      fontFamily: 'Libre Franklin',
                      fontSize: '45px',
                      color: '#DB654E',
                    },
                  },
                ],
                text: '1,269,000',
              },
            ],
          },
        ],
      },
    },
    fontsToLoad: ['Libre Franklin'],
    thumbnail: {
      src: AdditionalUnitsThumbnail,
      altText: 'Additional units',
    },
  },
  // Quote
  {
    widthPx: 282,
    heightPx: 116.78,
    backgroundShapeData: {
      fillColor: ['#fff'],
      cornerRadius: 10,
      border: {
        color: '#24C0CF',
        width: 4,
        style: BorderStyle.Dashed,
      },
    },
    textWidgetData: {
      widthPx: 242,
      heightPx: 76.78,
      proseMirrorData: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: {
              textAlign: 'center',
              lineHeight: '1.2',
            },
            content: [
              {
                text: '“I was treated with respect and the support team was quick to solve my problem. Definitely will recommend this service!”',
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: {
                      color: '#2B2B35',
                      fontSize: '15px',
                      fontFamily: 'Inter',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    thumbnail: {
      src: QuoteThumbnail,
      altText: 'Quote',
    },
  },
];
