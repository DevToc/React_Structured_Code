import { Patch } from 'immer';
import { RichDocument, Replaceable } from './types';

/**
 * Applies user's content to list of replaceables.
 *
 * Tries to find the best Replaceable for each RichElement contained in RichDocument.
 *
 * The resulting patch can be applied to InfographState.
 *
 * @param content User's content, enriched with contextual and graphical information
 * @param replaceable List of replaceable content of a template
 * @returns Patches that can be applied to InfographState
 */
export function applyContent(content: RichDocument, replaceable: Replaceable[]): Patch[] {
  // currently this simply matches role of the context and replaceable 1:1.

  // for each rich document element, find a replaceable - by matching role
  const patches: Patch[] = [];

  for (const el of content.elements) {
    const role = el.context?.role;

    // skip if role is not found
    if (!role) {
      console.debug('role not found on element');
      continue;
    }

    // find replaceable
    const suitableReplaceable = replaceable.find((r) => {
      const hints = r.rolesHint;
      return hints.indexOf(role) >= 0;
    });

    // replaceable not found
    if (!suitableReplaceable) {
      console.debug(`suitable Replaceable not found for role ${role}`);
      continue;
    }

    // Make patch
    // TODO: schema validation for value
    patches.push({
      op: suitableReplaceable.jsonOp,
      path: suitableReplaceable.jsonPath,
      value: el.element.rawText,
    });
  }

  return patches;
}

// export const ReplaceMapSchema: JSONSchemaType<ReplaceMap> = {
//   type: 'object',
// };

/**
 * Schema that represents programmatically editable content of a template.
 *
 * Things that this class can do :
 *  - Create/edit schema that represents programmatically editable widgets
 *  - Generate
 */
// export class TemplateSchema {
//   replaceables: Replaceable[] = [];
//
//   /**
//    * Create new schema.
//    *
//    * If parameter `schema` is given, it loads that schema. If not given, initializes new empty schema.
//    *
//    * @param infographState Target infograph
//    * @param schema Existing schema object that was saved with `toJSON()`
//    */
//   constructor(infographState: InfographState, schema?: object) {}
//
//   /**
//    * Creates JSON friendly object that can be saved to db as json.
//    */
//   toJSON(): object {
//     return {};
//   }
// }

/**
 * User's content parsed with hierarchy and rich metadata about the document.
 *
 * This content labels text or any other piece of content with types(header, paragraph, etc),
 * metadata, or anything - place to add metadata about the content.
 */
// export class UserContent {
//   content: RichDocument;
//
//   constructor() {
//     this.content = {
//       sections: [],
//     };
//   }
//
//   // Create UserContent from a raw string
//   static parseString(s: string): UserContent {
//     return new UserContent();
//   }
// }

/**
 * Taking entire user document, add graphics or context to all elements whenever appropriate.
 *
 * This is the function/api that will add our own content, or context, to the user's raw input.
 *
 * Adds additional context, graphics, to the `userDoc` in place.
 *
 * @param userDoc
 */
// function generateSuggestions(userDoc: RichDocument) {}

// function example() {
//   // The following should be created when admin clicks on an element on a template - to indicate
//   // this widget is 'replaceable'
//
//   // This replaceable indicates that this text widget described in `jsonPath` is
//   // suitable for 'primary-header' context text.
//   const replaceableHeaderWidget: Replaceable = {
//     contextHints: [{ role: 'primary-header' }], // this replaceable is suitable for primary header
//     graphicalHints: [], // this replaceable is suitable for text, not graphics
//     jsonOp: 'replace', // JSON patch op
//     jsonPath: ['widgets', '001.abcdef', 'proseMirrorData', 'content', '0', 'content', '0', 'text'], // JSON path - where the value should be placed
//     name: 'primary-header', // name to identify. not really used, just here for convenience
//     valueSchema: { type: 'string' }, // what kind of value this replaceable needs
//     // in future, might need some template, if replaced value is complex (an object with multiple varying values)
//   };
//
//   const replaceableTextWidget: Replaceable = {
//     contextHints: [{ role: 'body-paragraph' }], // this replaceable is suitable for body paragraph
//     graphicalHints: [], // this replaceable is suitable for text, not graphics
//     jsonOp: 'replace', // JSON patch op
//     jsonPath: ['widgets', '001.oieuoiwueqr', 'proseMirrorData', 'content', '0', 'content', '0', 'text'], // JSON path - where the value should be placed
//     name: 'primary-header', // name to identify. not really used, just here for convenience
//     valueSchema: { type: 'string' }, // what kind of value this replaceable needs
//     // in future, might need some template, if replaced value is complex (an object with multiple varying values)
//   };
//
//   // Right now this replaceable can only replace icons8 by id - in future, may be make this more flexible, so
//   // any icons can be used.
//   // Or rather, allow any IconWidget data to be replaceable. - This makes the replaceable super flexible (since the input becomes just widget data -
//   // but it'll come with added complexity, since replaceable matcher needs to become aware of widget data.
//   // Main reason thie json patch approach is used, is to hide the widget data specific logic from matcher.
//   // Try NOT to have this replace entire widget data, but rather, very specific props of widget data only.
//   // One thing to improve, is to group these into one - in case you need to update more than one field to update(eg. text + size)
//   const replaceableIconWidget: Replaceable = {
//     contextHints: [], // this replaceable is suitable for primary header
//     graphicalHints: ['icons8-50x50'], // this replaceable is suitable for small icon 50x50 - this "type-hint" needs to be improved.
//     jsonOp: 'replace', // JSON patch op
//     jsonPath: ['widgets', '003.abcdef', 'icons8Id'], // JSON path - where the value should be placed
//     name: 'main-icon', // name to identify. not really used, just here for convenience
//     valueSchema: { type: 'string' }, // what kind of value this replaceable needs (id string of the icon)
//     // in future, might need some template, if replaced value is complex (an object with multiple varying values)
//   };
//
//   const replaceables: Replaceable[] = [replaceableHeaderWidget, replaceableTextWidget, replaceableIconWidget];
//
//   // The replaceables above is saved on a new column in `templates` table. (when admin finishes "tagging" the template)
//
//   // this is a user input - for prototype, we'll two fixed form fields mapped directly to this.
//   // But later when parsing a document, these will represent 'tokens' from the input. (each paragraph, or sentence, gets one element)
//
//   const headerElement: RichElement<string> = {
//     type: 'text',
//     element: 'Actual header text from user',
//     graphics: {},
//     context: {
//       // Context of this text element
//       role: 'primary-header',
//     },
//   };
//
//   // This is a body paragraph.
//   // in prototype, the `element` prop is mapped directly to user input.
//   const bodyElement: RichElement<string> = {
//     type: 'text',
//     element: 'Some body paragraph from user',
//     graphics: undefined,
//     context: {
//       role: 'body-paragraph',
//     },
//   };
//
//   // In prototype, we only have these two elements
//   const section: Section = {
//     members: [headerElement, bodyElement],
//   };
//
//   // In prototype, we have one section.
//   const userContent: RichDocument = {
//     sections: [section],
//   };
//
//   // So the headerElement and bodyElement above only consists of user data.
//   // Now we are going to "generate" or pick the relevant icons for the section
//   generateSuggestions(userContent);
//
//   // After the suggestions are added, we'll have new graphical hint added to the header element
//   // So the header element will look something like this
//
//   const headerElementNew: RichElement<string> = {
//     type: 'text',
//     element: 'Actual header text from user',
//     graphics: {
//       // This part is added by an api - saying this text element is best represented by this icon.
//       icons8: {
//         id: 'icon-12323',
//         url: 'https://icons8.com/some/icon',
//       },
//     },
//     context: {
//       // Context of this text element
//       role: 'primary-header',
//     },
//   };
//
//   // Now we have what is replaceable in a template from `replaceables` (which is from templates table, for this template)
//   // And we have rich user content `userContent` - that has user supplied header and paragraph, PLUS
//   // icon suggestion from backend.
//
//   // So now we will create a json patch, which will apply `userContent` to the template
//   const jsonPatch = generatePatch(userContent, replaceables);
//
//   // Now, create new template with `jsonPatch`, which will create new infograph.
//   // OR, you can apply this patch live on the editor, simply apply the patch to
//   // template infograph, then load that infograph to redux store.
//   // But if you do load this to redux, be careful about auto save - we do not want to 'save' this
//   // temporary infograph.
// }
