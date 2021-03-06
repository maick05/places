import { CheerioAPI } from 'cheerio';

export interface IPuppeteerRepository<
  ElementPlace,
  SearchElement,
  ValidOutputSearch
> {
  callEndpoint(searchParams: SearchElement): Promise<CheerioAPI>;

  getDocumentHtml(url: string): Promise<CheerioAPI>;

  getDataHtml(): Promise<string>;

  goToUrl(url: string): Promise<void>;

  buildElementsFromDocument(
    searchParams: SearchElement,
    convertedSearch: ValidOutputSearch,
    $: CheerioAPI
  ): ElementPlace[];

  validateInput(searchParams: SearchElement): void;

  validateOutput(output: ElementPlace[]): void;
}
