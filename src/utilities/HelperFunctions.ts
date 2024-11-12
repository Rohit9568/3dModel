import { colorScale, imageExtensions, videoExtensions } from "./PreDefinedData";
export const stripHtml = (html: string) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || "";
};
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export function getUrlToBeSend(url: string) {
  const data = {
    request: {
      url,
    },
  };
  return data;
}
export function convertDate(dateStr: string): string {
  // Convert the input string to a Date object
  const dateObject = new Date(dateStr);

  // Extract year, month, and day from the date object
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Months are 0 indexed, so add 1
  const day = dateObject.getDate();

  // Format month and day to have leading zeros if necessary
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");

  // Format the date as 'month/day/year' and return
  const formattedDate = `${monthStr}/${dayStr}/${year.toString().slice(-2)}`;
  return formattedDate;
}

export function secondsToTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);

  return `${minutes} min.`;
}

export function blobToFile(blob: any, fileName: any) {
  const timestamp = Date.now();
  const file = new File([blob], fileName, {
    type: blob.type,
    lastModified: timestamp,
  });
  return file;
}
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};
export const convertDateToHMS = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};
export const convertMillisecondsToHMS = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
export const calculatePercentage = (totalMarks: number, maxMarks: number) => {
  return ((totalMarks / maxMarks) * 100).toFixed(2);
};
export function toProperCase(inputString: string) {
  // Split the input string into an array of words
  let words = inputString.split(" ");

  // Capitalize the first letter of each word
  let properCaseWords = words.map((word) => {
    // Handle words with apostrophes (e.g., O'Connor)
    let apostropheIndex = word.indexOf("'");
    if (apostropheIndex !== -1) {
      return (
        word.charAt(0).toUpperCase() +
        word.slice(1, apostropheIndex + 1) +
        word.charAt(apostropheIndex + 1).toUpperCase() +
        word.slice(apostropheIndex + 2)
      );
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  });

  // Join the words back into a single string
  let properCaseString = properCaseWords.join(" ");

  return properCaseString;
}

export const formatTimewithSecondsFormatting = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export function generateRandomFiveDigitNumber() {
  return Math.floor(Math.random() * 90000) + 10000;
}
export function isGapMoreThanOneWeek(testDates: string[]) {
  if (testDates.length === 0) {
    return false;
  }
  const firstTestDateStr = testDates[0];

  const firstTestDate = new Date(firstTestDateStr);

  const today = new Date();

  const dateDifference = today.getTime() - firstTestDate.getTime();

  const daysDifference = dateDifference / (1000 * 60 * 60 * 24);

  return daysDifference > 7;
}

export function arrayToQueryString(key: string, stringArray: string[]) {
  if (!Array.isArray(stringArray)) {
    return "";
  }
  if (stringArray.length === 0) {
    return "";
  }
  const queryString = stringArray
    .map((value) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return queryString;
}

export function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}
export function getRandomElementsFromArray<T>(
  array: T[],
  numberOfElements: number
): T[] {
  if (numberOfElements >= array.length) {
    return array.slice();
  }

  const shuffledArray = array.slice(); // Create a copy of the original array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray.slice(0, numberOfElements);
}

export function hideLongStrings(str: string, len: number) {
  if (str.length <= len) return str;
  else return str.substring(0, len) + "...";
}

export function convertToHyphenSeparated(str: string) {
  return str.split(" ").join("-").toLowerCase();
}

export const sendMessage = (url: string) => {
  const messageText = encodeURIComponent(url);
  const messageUrl = `sms:?body=${messageText}`;
  window.open(messageUrl);
};

export function cleanString(str: string) {
  str = str.replace(/\s+/g, " ").trim();
  str = str.toLowerCase();
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

export function addStylingToImage(htmlString: string): string {
  const regex = /<img[^>]+data-size="([^">]+)"/g;
  const matches = htmlString.match(regex);
  if (matches) {
    let modifiedHtmlString = htmlString;
    matches.forEach((match) => {
      const imageSizeMatch = match.match(/data-size="([^">]+)"/);
      if (imageSizeMatch && imageSizeMatch[1]) {
        const imageSize = imageSizeMatch[1];
        const [width, height] = imageSize.split(",");
        const aspectRatio = parseInt(width) / parseInt(height);
        const style = `width: 30%; aspect-ratio: ${aspectRatio};`;
        modifiedHtmlString = modifiedHtmlString.replace(
          match,
          `${match} style="${style}"`
        );
      }
    });
    return modifiedHtmlString;
  }
  return htmlString;
}

export const addTableBorder = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const tdElements = doc.getElementsByTagName("td");
  for (let i = 0; i < tdElements.length; i++) {
    const td = tdElements[i];
    td.setAttribute("style", "border: 1px solid black;padding:10px 5px;");
  }
  const trElements = doc.getElementsByTagName("tr");
  for (let i = 0; i < trElements.length; i++) {
    const tr = trElements[i];
    tr.setAttribute("style", "border: 1px solid black;");
  }

  const modifiedHtmlString = doc.documentElement.outerHTML;

  return modifiedHtmlString;
};

export const convertClassToClassName = (htmlString: string) => {
  const convertedString = htmlString.replace(/class=/g, "className=");
  return convertedString;
};
export function extractBase64StringsFromString(inputString: string) {
  const regex = /<img[^>]+src="data:image\/[^;]+;base64,([^">]+)"/g;
  const matches = inputString.match(regex);
  if (matches) {
    const base64Images = matches.map((match) => {
      const srcMatch = match.match(/src="([^">]+)"/);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
      }
      return "";
    });
    return base64Images;
  }
  return [];
}

export function base64StringToBlob(base64String: any, fileName: any) {
  const byteString = atob(base64String.split(",")[1]);
  const mimeString = base64String.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new File([uint8Array], fileName, { type: mimeString });
}
export const extractBase64Images = (markdown: string) => {
  const base64Images = [];
  const regex = /!\[.*\]\((data:image\/.*;base64,.*?)\)/g;
  let match;
  while ((match = regex.exec(markdown))) {
    base64Images.push(match[1]);
  }
  return base64Images;
};
export function isHTML(str: string) {
  const htmlPattern = /<("[^"]*"|'[^']*'|[^'">])*>/;
  return htmlPattern.test(str);
}

export function reduceImageScaleAndAlignLeft(htmlString: string) {
  var tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;

  var imgTags = tempElement.querySelectorAll("img");

  imgTags.forEach(function (img) {
    img.style.width = "50%";
    img.style.height = "50%";
    img.style.display = "block";
    img.style.margin = "0";
  });
  return tempElement.innerHTML;
}
export function reduceImageScaleAndAlignLeft2(htmlString: string) {
  var tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;

  var imgTags = tempElement.querySelectorAll("img");

  imgTags.forEach(function (img) {
    // img.style.width = "80%";
    // img.style.height = "80%";
    // img.style.scale = "0.5";
    var imgWidth = img.naturalWidth;
    // Check if the width is more than 60vw
    if (imgWidth > 0.3 * window.innerWidth) {
      img.style.width = "30%";
      img.style.height = "auto"; // Maintain aspect ratio
    }

    img.style.display = "inline";
    img.style.margin = "0";
  });
  return tempElement.innerHTML;
}

export function formatDate(date: Date) {
  date.setMilliseconds(date.getMilliseconds() + 21600000);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function getMonthName(date: Date): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[date.getMonth()];
}

export const formatDateFromNumberFormat = (inputDate: number) => {
  const parsedDate = new Date(inputDate);
  const formattedDate = `${parsedDate.getDate()}/${
    parsedDate.getMonth() + 1
  }/${parsedDate.getFullYear()}`;
  return formattedDate;
};

export function calculateRatioFromValue(
  numerator: number,
  denominator: number,
  targetValue: number
) {
  const ratio = numerator / denominator;
  const result = ratio * targetValue;
  return result;
}

export function getColorForPercentage(percentage: number) {
  if (percentage === 100) return colorScale[5].color;
  for (let i = 0; i < colorScale.length - 1; i++) {
    if (
      percentage >= colorScale[i].percent &&
      percentage < colorScale[i + 1].percent
    ) {
      return colorScale[i].color;
    }
  }
}

export function compareDatesOnly(date1: Date, date2: Date) {
  const onlyDate1 = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate()
  );
  const onlyDate2 = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate()
  );
  return onlyDate1 < onlyDate2;
}

export const glimpseDescription = (desc: string, length: number = 80) => {
  const strippedDesc = stripHtmlTags(desc);
  if (strippedDesc.length <= length) {
    return strippedDesc;
  }
  return strippedDesc.substring(0, length) + "...";
};
export const stripHtmlTags = (input: string) => {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.body.textContent || "";
};

export function isDateOlderThan7Days(timestamp: number): boolean {
  const timestampMilliseconds: number = timestamp / 1000;
  const dateObject: Date = new Date(timestampMilliseconds * 1000);

  const currentDate: Date = new Date();
  const timeDifference: number = currentDate.getTime() - dateObject.getTime();

  return timeDifference > 7 * 24 * 60 * 60 * 1000;
}

type MediaType = "image" | "video" | "unknown";
export const getMediaType = (url: string): MediaType => {
  const extension: any = url.split(".").pop()?.toLowerCase();
  if (videoExtensions.includes(extension)) {
    return "video";
  } else if (imageExtensions.includes(extension)) {
    return "image";
  } else {
    return "unknown";
  }
};
export const getWebsiteLink = (url: string) => {
  const link = new URL(url);
  const websiteLink = `${link.protocol}//${link.host}`;
  return websiteLink;
};

export function extractFileName(url: string) {
  const parts = url.split("/");
  const fileName = parts[parts.length - 1];
  return fileName;
}

export function isHEIC(filename: File) {
  var fileExtension = filename.name.split(".").pop()?.toUpperCase();
  return fileExtension === "HEIC";
}
export function getVideoId(url: string) {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const simpleRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=)?([a-zA-Z0-9_-]{11})/;

  const youtubeMatch = url.match(youtubeRegex);
  const simpleMatch = url.match(simpleRegex);

  if (youtubeMatch) {
    return youtubeMatch[1];
  } else if (simpleMatch) {
    return simpleMatch[1];
  } else {
    return null;
  }
}
export function convertToEmbedLink(youtubeLink: string) {
  if (youtubeLink.includes("embed")) {
    return youtubeLink;
  }
  const videoID = getVideoId(youtubeLink);
  const embedLink = `https://www.youtube.com/embed/${videoID}`;

  return embedLink;
}

export function convertToRomanNumerals(input: string) {
  const classMap: any = {
    "1": "I",
    "2": "II",
    "3": "III",
    "4": "IV",
    "5": "V",
    "6": "VI",
    "7": "VII",
    "8": "VIII",
    "9": "IX",
    "10": "X",
    "11": "XI",
    "12": "XII",
  };

  const words = input.split(" ");

  if (words.length === 2) {
    const className = words[0].toUpperCase();
    const classNumber = words[1];

    if (classNumber in classMap) {
      const romanClassNumber = classMap[classNumber];
      const result = className + " " + romanClassNumber;
      return result;
    }
  }

  return input;
}
export function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
