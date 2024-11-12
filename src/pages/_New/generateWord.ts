import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

export const generateOnlyWordMcqs = async (
  numberOfTables: number,
  testName: string
) => {
  const tables = [];
  for (let i = 0; i < numberOfTables; i++) {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("MCQ")] }),
        ],
      })
    );

    // Row 2
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Question")] }),
          new TableCell({
            children: [new Paragraph("Type your question here")],
          }),
        ],
      })
    );

    // Rows 3 to 6
    for (let j = 1; j <= 4; j++) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(`Option ${j}`)] }),
            new TableCell({
              children: [new Paragraph(`Type Here`)],
            }),
          ],
        })
      );
    }

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Answer")] }),
          new TableCell({
            children: [new Paragraph("[correct option number]")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Solution")] }),
          new TableCell({
            children: [new Paragraph("Type your solution here")],
          }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Marks")] }),
          new TableCell({ children: [new Paragraph("1")] }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Negative Marks")] }),
          new TableCell({ children: [new Paragraph("0")] }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Difficulty")] }),
          new TableCell({ children: [new Paragraph("MEDIUM")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: testName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 1,
          }),
          new Paragraph({
            text: "This is Sample Format for MCQ format.(for multiple questions add the same table below this and don’t change the type of question and make the option correct or incorrect as given below).Maintain a gap between two tables. ",
            run: {
              // underline: true,
              // italics: true,
            },
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 0.5,
            style: "",
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          ...tables,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Create a Blob object and create a download link
  // const blobObject = new Blob([blob], {
  //   type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample-document.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const generateOnlyWordShort = async (
  numberOfTables: number,
  testName: string
) => {
  const tables = [];
  for (let i = 0; i < numberOfTables; i++) {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("SHORT")], columnSpan: 2 }),
        ],
      })
    );

    // Row 2
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Question")] }),
          new TableCell({
            children: [new Paragraph("Type your question here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Answer")] }),
          new TableCell({
            children: [new Paragraph("Type your answer here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Marks")] }),
          new TableCell({ children: [new Paragraph("1")] }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Negative Marks")] }),
          new TableCell({ children: [new Paragraph("0")] }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Difficulty")] }),
          new TableCell({ children: [new Paragraph("MEDIUM")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: testName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 1,
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          new Paragraph({
            text: "This is Sample Format for long Question format.(for multiple questions add the same table below this and don’t change the type of question). ).Maintain a gap between two tables. ",
            run: {
              // underline: true,
              // italics: true,
            },
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 0.5,
            style: "",
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          ...tables,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Create a Blob object and create a download link
  // const blobObject = new Blob([blob], {
  //   type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample-document.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
export const generateOnlyWordLong = async (
  numberOfTables: number,
  testName: string
) => {
  const tables = [];
  for (let i = 0; i < numberOfTables; i++) {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("LONG")], columnSpan: 2 }),
        ],
      })
    );

    // Row 2
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Question")] }),
          new TableCell({
            children: [new Paragraph("Type your question here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Answer")] }),
          new TableCell({
            children: [new Paragraph("Type your answer here")],
          }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Solution")] }),
          new TableCell({
            children: [new Paragraph("Type your solution here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Marks")] }),
          new TableCell({ children: [new Paragraph("1")] }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Negative Marks")] }),
          new TableCell({ children: [new Paragraph("0")] }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Difficulty")] }),
          new TableCell({ children: [new Paragraph("MEDIUM")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: testName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 1,
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          new Paragraph({
            text: "This is Sample Format for long Question format.(for multiple questions add the same table below this and don’t change the type of question). ).Maintain a gap between two tables. ",
            run: {
              // underline: true,
              // italics: true,
            },
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 0.5,
            style: "",
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          ...tables,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Create a Blob object and create a download link
  // const blobObject = new Blob([blob], {
  //   type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample-document.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
export const generateOnlyInteger = async (
  numberOfTables: number,
  testName: string
) => {
  const tables = [];
  for (let i = 0; i < numberOfTables; i++) {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("INT")], columnSpan: 2 }),
        ],
      })
    );

    // Row 2
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Question")] }),
          new TableCell({
            children: [new Paragraph("Type your question here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Answer")] }),
          new TableCell({
            children: [new Paragraph("Type your answer here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Solution")] }),
          new TableCell({
            children: [new Paragraph("Type your solution here")],
          }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Marks")] }),
          new TableCell({ children: [new Paragraph("1")] }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("NegativeMarks")] }),
          new TableCell({ children: [new Paragraph("0")] }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Difficulty")] }),
          new TableCell({ children: [new Paragraph("MEDIUM")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: testName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 1,
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          new Paragraph({
            text: "This is Sample Format for long Question format.(for multiple questions add the same table below this and don’t change the type of question). ).Maintain a gap between two tables. ",
            run: {
              // underline: true,
              // italics: true,
            },
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 0.5,
            style: "",
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          ...tables,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Create a Blob object and create a download link
  // const blobObject = new Blob([blob], {
  //   type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample-document.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const generateOnlyWordCaseQ = async (
  numberOfTables: number,
  testName: string
) => {
  const tables = [];
  for (let i = 0; i < numberOfTables; i++) {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("LCBQ")] }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("CasebasedText")] }),
          new TableCell({
            children: [new Paragraph("Type Your Case Based Question Here")],
          }),
        ],
      })
    );

    // Row 2
    for (let k = 0; k < 2; k++) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Question")] }),
            new TableCell({
              children: [new Paragraph(`Type your question ${k + 1} here`)],
            }),
          ],
        })
      );

      // Rows 3 to 6
      for (let j = 1; j <= 4; j++) {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(`Option ${j}`)] }),
              new TableCell({ children: [new Paragraph(`Type Here`)] }),
            ],
          })
        );
      }
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Answer")] }),
            new TableCell({
              children: [new Paragraph("[correct option number]")],
            }),
          ],
        })
      );
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Solution")] }),
            new TableCell({
              children: [new Paragraph("Type your solution here")],
            }),
          ],
        })
      );

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Total Marks")] }),
            new TableCell({ children: [new Paragraph("1")] }),
          ],
        })
      );
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Negative Marks")] }),
            new TableCell({ children: [new Paragraph("0")] }),
          ],
        })
      );
    }

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Difficulty")] }),
          new TableCell({ children: [new Paragraph("MEDIUM")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: testName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 1,
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          new Paragraph({
            text: "This is Sample Format for case based Question.(for multiple questions add the same table below this and don’t change the type of question). ).Maintain a gap between two tables. ",
            run: {
              // underline: true,
              // italics: true,
            },
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 0.5,
            style: "",
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          ...tables,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Create a Blob object and create a download link
  // const blobObject = new Blob([blob], {
  //   type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample-document.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const generateAllWordQ = async (
  numberOfTables: number,
  testName: string
) => {
  let mcqQ = 0;
  let caseQ = 0;
  let shortQ = 0;
  let longQ = 0;

  if (numberOfTables === 1) {
    mcqQ = 1;
  }
  if (numberOfTables === 2) {
    mcqQ = 1;
    shortQ = 1;
  }
  if (numberOfTables === 3) {
    longQ = 1;
    shortQ = 1;
    mcqQ = 1;
  }
  if (numberOfTables === 4) {
    longQ = 1;
    shortQ = 1;
    mcqQ = 1;
    caseQ = 1;
  }
  if (numberOfTables === 5) {
    longQ = 1;
    shortQ = 1;
    mcqQ = 2;
    caseQ = 1;
  }
  if (numberOfTables > 6) {
    const noofeachQ = Math.floor((numberOfTables - 2) / 3);
    longQ = noofeachQ;
    shortQ = noofeachQ;
    mcqQ = noofeachQ + ((numberOfTables - 2) % 3);
    caseQ = 2;
  }
  const tables = [];
  for (let i = 0; i < mcqQ; i++) {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("MCQ")] }),
        ],
      })
    );

    // Row 2
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Question")] }),
          new TableCell({
            children: [new Paragraph("Type your question here")],
          }),
        ],
      })
    );

    // Rows 3 to 6
    for (let j = 1; j <= 4; j++) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(`Option ${j}`)] }),
            new TableCell({ children: [new Paragraph(`Type Here`)] }),
          ],
        })
      );
    }
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Answer")] }),
          new TableCell({
            children: [new Paragraph("[correct option number]")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Solution")] }),
          new TableCell({
            children: [new Paragraph("Type your solution here")],
          }),
        ],
      })
    );
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Marks")] }),
          new TableCell({ children: [new Paragraph("1")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }
  for (let i = 0; i < longQ; i++) {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("LONG")], columnSpan: 2 }),
        ],
      })
    );

    // Row 2
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Question")] }),
          new TableCell({
            children: [new Paragraph("Type your question here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Answer")] }),
          new TableCell({
            children: [new Paragraph("Type your answer here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Marks")] }),
          new TableCell({ children: [new Paragraph("1")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }
  for (let i = 0; i < shortQ; i++) {
    const tableRows = [];

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("SHORT")], columnSpan: 2 }),
        ],
      })
    );

    // Row 2
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Question")] }),
          new TableCell({
            children: [new Paragraph("Type your question here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Answer")] }),
          new TableCell({
            children: [new Paragraph("Type your answer here")],
          }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Marks")] }),
          new TableCell({ children: [new Paragraph("1")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }
  for (let i = 0; i < caseQ; i++) {
    const tableRows = [];
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Type")] }),
          new TableCell({ children: [new Paragraph("CASE")] }),
        ],
      })
    );

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("CasebasedText")] }),
          new TableCell({
            children: [new Paragraph("Type Your Case Based Question Here")],
          }),
        ],
      })
    );

    // Row 2
    for (let k = 0; k < 2; k++) {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Question")] }),
            new TableCell({
              children: [new Paragraph(`Type your question ${k + 1} here`)],
            }),
          ],
        })
      );

      // Rows 3 to 6
      for (let j = 1; j <= 4; j++) {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(`Option ${j}`)] }),
              new TableCell({ children: [new Paragraph(`Type Here`)] }),
            ],
          })
        );
      }
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Answer")] }),
            new TableCell({
              children: [new Paragraph("[correct option number]")],
            }),
          ],
        })
      );
    }

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Total Marks")] }),
          new TableCell({ children: [new Paragraph("1")] }),
        ],
      })
    );

    const table = new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },

      // alignment: {
      //   vertical: VerticalAlign.CENTER,
      // },
      alignment: "center",
      margins: {
        bottom: 20,
      },
    });
    const space = new Paragraph(" ");
    tables.push(table);
    tables.push(space);
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: testName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 1,
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          new Paragraph({
            text: "This is Sample Format for questions.(for multiple questions add the same table below this and don’t change the type of question). ).Maintain a gap between two tables. ",
            run: {
              // underline: true,
              // italics: true,
            },
            heading: HeadingLevel.HEADING_6,
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 200, // Add space after the heading
            },
            scale: 0.5,
            style: "",
            // spacingBefor: 200,
            // style:"",
            // font: {
            //   size: 24,
            // },
          }),
          ...tables,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Create a Blob object and create a download link
  // const blobObject = new Blob([blob], {
  //   type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample-document.doc";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
