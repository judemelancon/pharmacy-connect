export type Group = {
    connection: string;
    items: string[];
};

export type Puzzle = {
    slug: string;
    name: string;
    groups: Group[];
};

export type ColorClassName = 'blue' | 'red' | 'yellow' | 'grey';

export const ColorClassNames: ColorClassName[] = ['blue', 'red', 'yellow', 'grey'];

export type Item = {
    text: string;
    color: ColorClassName;
    done: boolean;
    active: boolean;
};
