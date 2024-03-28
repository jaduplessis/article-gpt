
export enum SectionTypes {
  text = "text",
  code = "code",
  image = "image",
}

export interface FileSections {
  order: number;
  type: SectionTypes;
  content: string;
  styledText?: string;
}

export const processLineByLine = (file: string) => {
  const lines = file.split("\n");

  const textDivider = "---";
  const codeDivider = "```";
  const imageDivider = "![";

  let sections: FileSections[] = [];
  let numTextSections = 0;
  let order = 0;
  let currentSection = {
    order,
    type: SectionTypes.text,
    content: "",
  };

  lines.forEach((line) => {
    if (line === textDivider) {
      if (!isEmpty(currentSection)) {
        sections.push(currentSection);
        numTextSections++;
        order++;
      }

      currentSection = {
        order,
        type: SectionTypes.text,
        content: "",
      };
    } else if (line.startsWith(codeDivider)) {
      if (currentSection.type === SectionTypes.code) {
        currentSection.content += line + "\n";

        if (!isEmpty(currentSection)) {
          sections.push(currentSection);
          order++;
        }

        currentSection = {
          order,
          type: SectionTypes.text,
          content: "",
        };
      } else {
        if (!isEmpty(currentSection)) {
          sections.push(currentSection);
          numTextSections++;
          order++;
        }
        currentSection = {
          order,
          type: SectionTypes.code,
          content: "",
        };
      }
    } else if (line.startsWith(imageDivider)) {
      sections.push(currentSection);
      order++;

      sections.push({
        order,
        type: SectionTypes.image,
        content: line,
      });

      currentSection = {
        order,
        type: SectionTypes.text,
        content: "",
      };
    } else {
      currentSection.content += line + "\n";
    }
  });

  sections.push(currentSection);
  numTextSections++;

  return {
    sections,
    numTextSections,
  };
};

const isEmpty = (sections: FileSections): boolean => {
  const { content, type } = sections;

  if (type === SectionTypes.code) return false;
  if (type === SectionTypes.image) return false;

  switch (content) {
    case "":
    case " ":
    case "\n":
    case "\n\n":
    case "\r":
    case "\t":
      return true;
    default:
      return false;
  }
};
