declare module "resplendence" {
  function resplendent(
    element: string,
    name: string
  ): (str: TemplateStringsArray) => (props: Record<string, any>) => any;
  function resplendent(str: TemplateStringsArray): void;
  function resplendent(): (str: TemplateStringsArray) => string;

  export default resplendent;
}
