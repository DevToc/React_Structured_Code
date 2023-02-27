import React from 'react';

export type MenuType = {
  [key: string]: {
    checked?: boolean;
    data?: MenuType;
    Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    label?: string;
    onClick?: (evt: React.MouseEvent<HTMLButtonElement>) => void;
  };
};
