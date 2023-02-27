import { JSONSchemaType } from 'ajv';

/**
 * Supported graphical items that can be used in the `Replaceable` infograph template.
 */
export interface Graphical {
  icons8?: {
    id: string;
    url: string;
  };
  backgroundImage?: {
    url: string;
    size: {
      widthPx: number;
      heightPx: number;
    };
  };
  // TODO: future decorative items support
  // borders, colors, etc
}

export type Roles = 'primary-header' | 'body-paragraph' | 'page-background-color';

/**
 * Context provides information to `Replaceable` infograph template, to match the element to
 * appropriate `Replaceable` item.
 */
export interface Context {
  role: Roles;
  openaiKeywords?: string[];
  icons8QueryResults?: object;
}

export type TextElement = { rawText: string };

/**
 * Represents atomic element of user content, which can be 'enriched' with graphical or contextual
 * information.
 */
export interface RichElement {
  element: TextElement; // Can be any element that exists in the original document/input
  graphics?: Graphical; // Graphical items which best describes the element
  context?: Context; // Contextual information about the element
}

// TODO: support sections later
// interface Section {
//   members: Array<RichElement<any>>;
// }

/**
 * Object that represents rich content (tokenized + tagged multi content - text, images, etc)
 */
export interface RichDocument {
  // TODO: Future use
  // category - describes topic, eg. internal communication, flyer, presentation, etc?
  // sections: Section[];
  elements: Array<RichElement>;
}

/**
 * Atomic entity that can be replaced.
 *
 * Used as a target, describing what can be replaced and how - used to generate JSON patch, to be
 * applied to InfographState.
 */
export interface Replaceable {
  rolesHint: Roles[]; // What kind of roles this replaceable is suited for, ordered by importance
  valueSchema: JSONSchemaType<any>; // Additional filters for this replaceable which will work well, like text length limit
  jsonPath: string[]; // path of json patch
  jsonOp: 'replace' | 'add' | 'remove'; // op needed in json patch
}

export interface ReplaceableText extends Replaceable {
  minLength?: number; // Number of min chars that this replaceable is suitable for
  maxLength?: number; // Number of max chars that this replaceable is suitable for
}

export interface ReplaceableIcon extends Replaceable {
  iconType?: 'icons8'; // What kind of icon this replaceable will work with
}
