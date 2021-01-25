class TagsGenerator {
  createTag(type) {
    return document.createElement(type);
  }
}

export const tagsGenerator = new TagsGenerator();
