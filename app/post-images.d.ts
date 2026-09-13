declare module "virtual:post-images" {
  const images: Record<
    string,
    Record<string, { width: number; height: number; srcSet?: string }>
  >;

  export default images;
}
