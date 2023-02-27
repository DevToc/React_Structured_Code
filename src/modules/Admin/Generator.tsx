import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  HStack,
  ListItem,
  Text,
  Textarea,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import { backend } from '../../libs/e2api/query';
import { backend as backend2 } from 'libs/e2api/get';
import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import { store, useAppDispatch, useAppSelector, newStore } from '../Editor/store';
import { InfographState } from 'types/infographTypes';
// import { WidgetType } from '../../types/widget.types';
import { ReadOnlyStructureTreeListWidgetRenderer } from '../../widgets/WidgetRenderer';
import { Provider } from 'react-redux';
import { applyPatches, enablePatches, Patch } from 'immer';
import { Page } from '../common/components/Page';
import {
  selectInfographHeightPx,
  selectInfographWidthPx,
  selectPageBackground,
} from '../Editor/store/infographSelector';
import { selectActivePage } from '../Editor/store/pageSelector';
import { initialState, loadInfograph } from '../Editor/store/infographSlice';
import { setActivePageId } from '../Editor/store/pageControlSlice';
import { APIBackend } from '../../libs/e2api/APIBackend';
import { Client } from '../../libs/e2api/Client';
import { RichDocument, Replaceable } from '../../libs/smart-template/types';
import { applyContent } from '../../libs/smart-template/SmartTemplate';
import { Icon } from '../../widgets/IconWidget/Icon';
import { FillDirection } from '../../widgets/IconWidget/IconWidget.types';

enablePatches();

interface SectionComponentProp {
  jwtToken: string;
}

let be: APIBackend;
let client: Client;

// export const getWidgetKey = (value: string) => {
//   return Object.keys(WidgetType)[Object.values(WidgetType).indexOf(value.substring(0, 3) as WidgetType)];
// };

// function prettyTree(tree: Array<any>, prefix: string): string {
//   const [tag, , child] = tree;
//
//   if (typeof child === 'string') {
//     return `${prefix}${tag} - ${getWidgetKey(child)} (${child})`;
//   } else if (Array.isArray(child)) {
//     return `${prefix}${tag} - \n${child
//       .map((t) => {
//         return prettyTree(t, prefix.concat('  '));
//       })
//       .join('\n')}`;
//   } else {
//     return `${prefix}${tag} - unknown child`;
//   }
// }

// function getStructureTreeNice(pageObj: { widgetStructureTree?: Array<any> } = {}) {
//   if (!pageObj) {
//     return 'Page object not found';
//   }
//   const tree = pageObj['widgetStructureTree'];
//   if (!tree) {
//     return 'widgetStructureTree not found';
//   }
//   return prettyTree(tree, '');
// }

type TemplateType = {
  templateId: string;
  infographId: string;
  createdAt: string;
  modifiedAt: string;
  replaceables?: Replaceable[];
};

////////////////////////
type GeneratorContextType = {
  userDoc: RichDocument;
  templates: TemplateType[];
  previews: InfographState[];
  patches: Array<Patch[]>;
  setTemplates: (templates: TemplateType[]) => void;
  setUserDoc: (userDoc: RichDocument) => void;
  setPreviews: (previews: InfographState[]) => void;
  setPatches: (previews: Array<Patch[]>) => void;
};

const initContext = {
  userDoc: {
    elements: [],
  },
  previews: [],
  templates: [],
  patches: [],
  setPatches: () => {},
  setUserDoc: () => {},
  setTemplates: () => {},
  setPreviews: () => {},
};

const GeneratorContext = createContext<GeneratorContextType>(initContext);

/**
 * Given RichDocument, enrich it with additional context, like icons, images, etc.
 *
 * This is where we pick the right icons, images, or suggestions that doese not exist in
 * user's original input.
 *
 * @constructor
 */
const InferContext = (): ReactElement => {
  const { userDoc, setUserDoc } = useContext<GeneratorContextType>(GeneratorContext);

  const infer = async () => {
    const newRichDoc = await client.inferRichDocument(userDoc);
    setUserDoc(newRichDoc.document);
  };

  return (
    <VStack width={'100%'}>
      <Button size={'sm'} onClick={() => infer()}>
        Infer Additional Contexts
      </Button>
    </VStack>
  );
};

/**
 * Given RichDocument, apply the content to each of the template.
 * @constructor
 */
const ApplyContentToTemplates = (): ReactElement => {
  const { setPatches, templates, userDoc } = useContext<GeneratorContextType>(GeneratorContext);

  const generatePatches = () => {
    const patcheList: Patch[][] = [];
    for (const template of templates) {
      const patches = applyContent(userDoc, template.replaceables || []);
      patcheList.push(patches);
      console.debug(patches);
    }
    setPatches(patcheList);
  };

  return (
    <VStack>
      <Button colorScheme={'blue'} size={'sm'} onClick={generatePatches}>
        Update templates
      </Button>
    </VStack>
  );
};

const View = (): ReactElement => {
  const [userDoc, setUserDoc] = useState<RichDocument>({ elements: [] });
  const [previews, setPreviews] = useState<InfographState[]>([initialState, initialState]);
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [patches, setPatches] = useState<Array<Patch[]>>([]);

  const store: GeneratorContextType = {
    userDoc,
    templates,
    setTemplates,
    setUserDoc,
    setPreviews,
    setPatches,
    previews,
    patches,
  };

  return (
    <GeneratorContext.Provider value={store}>
      <HStack alignItems={'flex-start'} width={'100%'}>
        <VStack alignItems={'flex-start'} flex={1}>
          <InputControl />
          <InferContext />
          <ApplyContentToTemplates />
        </VStack>
        <Box flex={2}>
          <LoadTemplates />
          <InfographPreviews />
        </Box>
      </HStack>
    </GeneratorContext.Provider>
  );
};

const LoadTemplates = (): ReactElement => {
  const { setTemplates } = useContext<GeneratorContextType>(GeneratorContext);

  const loadTemplates = async () => {
    const tList: TemplateType[] = [];
    const t = await client.getReplaceableTemplates();
    if (t.templates) {
      for (const tt of t.templates || []) {
        tList.push(tt);
        console.debug(tt);
      }
    }
    setTemplates(tList);
  };
  return (
    <VStack>
      <Button size={'sm'} onClick={loadTemplates}>
        Load all replaceable templates
      </Button>
    </VStack>
  );
};

/**
 * Returns list of user-friendly description text of openaiKeywords per element in rich document.
 * @param doc
 */
function extractKeywords(doc: RichDocument): string[] {
  const keywords: string[] = [];
  for (const element of doc.elements) {
    if (element.context?.openaiKeywords) {
      keywords.push(`${element.context.role} - ${element.context.openaiKeywords.join(', ')}`);
    }
  }
  return keywords;
}

interface Icons8Meta {
  id: string;
  name: string;
  svg: string;
}

function extractIcons(doc: RichDocument): Array<{ role: string; icon: Icons8Meta }> {
  const icons8: Array<{ role: string; icon: Icons8Meta }> = [];
  for (const element of doc.elements) {
    if (element.context?.icons8QueryResults) {
      const ir = element.context.icons8QueryResults as any;
      for (const icon of ir.icons) {
        icons8.push({
          role: element.context.role,
          icon: icon as Icons8Meta,
        });
      }
    }
  }

  return icons8;
}

/**
 * Given user's input, create RichDocument represents user's document with additional
 * metadata.
 *
 * @constructor
 */
const InputControl = (): ReactElement => {
  const { userDoc, setUserDoc } = useContext<GeneratorContextType>(GeneratorContext);

  const [primaryHeading, setPrimaryHeading] = useState<string>('');
  const [bodyParagraph, setBodyParagraph] = useState<string>('');

  const parseUserInput = () => {
    setUserDoc({
      elements: [
        {
          element: {
            rawText: primaryHeading,
          },
          context: {
            role: 'primary-header',
          },
        },
        {
          element: {
            rawText: bodyParagraph,
          },
          context: {
            role: 'body-paragraph',
          },
        },
      ],
    });
  };

  return (
    <VStack width={'100%'} alignItems={'flex-start'}>
      <Box width={'100%'}>
        <Heading size={'sm'}>Primary Heading</Heading>
        <Textarea height={'10vh'} value={primaryHeading} onChange={(e) => setPrimaryHeading(e.target.value)} />
      </Box>
      <Box width={'100%'}>
        <Heading size={'sm'}>Body Paragraph</Heading>
        <Textarea height={'10vh'} value={bodyParagraph} onChange={(e) => setBodyParagraph(e.target.value)} />
      </Box>
      <Button size={'sm'} onClick={() => parseUserInput()}>
        Parse input
      </Button>
      <Accordion width={'100%'} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                Parsed RichDocument
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Textarea height={'30vh'} onChange={(e) => true} value={JSON.stringify(userDoc, null, 2)} />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                Context
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text fontWeight={'bold'}>Keywords</Text>
            {extractKeywords(userDoc)?.map((s, i) => (
              <Text key={i}>{s}</Text>
            ))}
            <Text fontWeight={'bold'}>Icons</Text>
            <HStack>
              {extractIcons(userDoc)?.map((s, i) => (
                <Box key={i} w={'50px'} h={'50px'} position={'relative'}>
                  <Icon
                    iconConfig={{
                      shapeColorOne: 'black',
                      shapeFill: 100,
                      fillDirection: FillDirection.TopDown,
                    }}
                    iconData={{
                      svg: s.icon.svg,
                      color: 0,
                    }}
                  />
                </Box>
              ))}
            </HStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

const ReplaceableEditor = ({
  replaceables,
  applyPatch,
}: {
  replaceables: Replaceable[];
  applyPatch: (patch: Patch) => void;
}): ReactElement => {
  // Create randomized color values
  const randomizeColor = (replaceable: Replaceable) => {
    // dumb color
    const c = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255,
    )}, 1)`;

    const patch: Patch = {
      op: replaceable.jsonOp,
      path: replaceable.jsonPath,
      value: c,
    };

    // apply patch
    applyPatch(patch);
  };

  return (
    <Box>
      <Text>Replaceables</Text>
      <UnorderedList>
        {replaceables.map((r, i) => {
          let RandButton = null;
          if (r.rolesHint[0] === 'page-background-color') {
            RandButton = (
              <Button size={'xs'} onClick={() => randomizeColor(r)}>
                Rand Color
              </Button>
            );
          }

          return (
            <ListItem key={i}>
              <Text size={'xs'}>{r.rolesHint}</Text>
              {RandButton}
            </ListItem>
          );
        })}
      </UnorderedList>
    </Box>
  );
};

const PreviewProvider = ({
  infographId,
  patches = [],
  replaceables = [],
}: {
  replaceables: Replaceable[];
  infographId: string;
  patches: Patch[];
}): ReactElement => {
  const [infoState, setInfoState] = useState<InfographState>(initialState);

  const infoStore = newStore();

  const applyPatch = (patch: Patch) => {
    const patched = applyPatches(infoState, [patch]);
    setInfoState(patched);
  };

  useEffect(() => {
    if (!infographId) return;

    // Fetch infograph state
    const getInfographState = async () => {
      const fullState = await client.getFullInfograph(infographId);
      const patched = applyPatches(fullState, patches);
      setInfoState(patched);
    };

    getInfographState();
  }, [infographId, patches]);

  return (
    <Provider store={infoStore}>
      <HStack>
        <InfographExportViewLoader infographState={infoState} />
        <ReplaceableEditor replaceables={replaceables} applyPatch={applyPatch} />
      </HStack>
    </Provider>
  );
};

const InfographPreviews = (): ReactElement => {
  const { templates, patches } = useContext<GeneratorContextType>(GeneratorContext);

  return (
    <VStack>
      {templates.map((v, i) => (
        <PreviewProvider
          infographId={v.infographId}
          replaceables={v.replaceables || []}
          key={v.infographId || i}
          patches={patches[i] || []}
        />
      ))}
    </VStack>
  );
};

const InfographExportViewLoader = ({ infographState }: { infographState: InfographState }): ReactElement => {
  const dispatch = useAppDispatch();

  const widthPx = useAppSelector(selectInfographWidthPx);
  const heightPx = useAppSelector(selectInfographHeightPx);
  const activePageId = useAppSelector(selectActivePage);
  const pageBackground = useAppSelector(selectPageBackground(activePageId));
  useEffect(() => {
    if (dispatch && infographState) {
      const pageId = infographState.pageOrder[0] || '';
      dispatch(loadInfograph(infographState));
      dispatch(setActivePageId(pageId));
    }
  }, [dispatch, infographState]);

  return (
    <>
      {activePageId && (
        <Page
          testId={activePageId}
          className='page-container'
          bg={pageBackground}
          width={widthPx}
          height={heightPx}
          zoom={1}
          borderRadius='none'
          boxShadow='none'
          overflow='hidden'
        >
          <ReadOnlyStructureTreeListWidgetRenderer pageId={activePageId} />
        </Page>
      )}
    </>
  );
};

/**
 * Generate infograph.
 */
export function GeneratorPage({ jwtToken }: SectionComponentProp) {
  backend.setAuthToken(jwtToken);
  backend2.setAuthToken(jwtToken);

  if (!be) {
    be = new APIBackend({ authToken: jwtToken });
    client = new Client(be);
  }

  return (
    <Provider store={store}>
      <View />
    </Provider>
  );
}
