import React from "react";

const getCombinedHTMLFromTopics = (topics: SingleTopic[]): JSX.Element => {
  let bodyContentHTML = topics.reduce((acc, topic) => {
    // Attempt to match the content within the <body> tags
    const regex = /<body[^>]*>([\s\S]*?)<\/body>/i;
    const matches = regex.exec(topic.theory);

    if (matches && matches[1]) {
      acc += `<h1>${topic.name}</h1>${matches[1]}`;
    } else {
      acc += `<h1>${topic.name}</h1>`;
    }

    return acc;
  }, "");

  // Debug output to console (optional, for troubleshooting)

  // Function to create markup for dangerouslySetInnerHTML
  const createMarkup = () => ({ __html: bodyContentHTML });

  return (
    <div>
      {/* Render the combined HTML content */}
      <div dangerouslySetInnerHTML={createMarkup()} />
    </div>
  );
};

export default getCombinedHTMLFromTopics;
