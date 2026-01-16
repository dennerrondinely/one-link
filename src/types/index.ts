export interface Link {
  appUrl: string;
  webUrl: string;
  name: string;
  appStore: string;
  playStore: string;
}

export interface Links {
  [key: string]: Link;
}
