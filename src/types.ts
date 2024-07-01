export type Group = {
    connection: string;
    items: string[];
};

export type Puzzle = {
    slug: string;
    name: string;
    secret?: boolean;
    groups: Group[];
};

export type Item = {
    text: string;
    active: boolean;
};
