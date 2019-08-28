const { getAccessToken, textToSpeech } = require("./workers");
const readline = require("readline-sync");

const subscriptionKey = process.env.COGNITIVE_SERVICE_KEY;

const textString = "And you as well must die beloved dust and all your beauty stand you in no stead; This flawless, vital hand, this perfect head, This body of flame and steel, before the gust Of Death, or under his autumnal frost, Shall be as any leaf, be no less dead Than the first leaf that fell,—this wonder fled. Altered, estranged, disintegrated, lost. Nor shall my love avail you in your hour. In spite of all my love, you will arise Upon that day and wander down the air Obscurely as the unattended flower, It mattering not how beautiful you were,Or how beloved above all else that dies."

async function main() {
  if (!subscriptionKey) {
    throw new Error(
      "Environment variable for your subscription key is not set."
    );
  }
  // Prompts the user to input text

  const text = readline.question("What would you like to convert to speech: ");
  console.log(text);

  try {
    const accessToken = await getAccessToken(subscriptionKey);
   
    await textToSpeech(accessToken, textString);
  } catch (error) {
    console.log(`Something went wrong: ${error}`);
  }
}
main();
