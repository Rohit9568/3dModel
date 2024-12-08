
enum AnatomyEnglishLanguageEnums{
    Preferences='Preferences',
    Overview="Overview",
    Languages="Languages",
    Preference_Content="Preferences allow you to change the language of this simulation. Select your preferred language to use the simulation accordingly.",
    Rotate="Rotate",
    Pan="Pan",
    Reset="Reset",
    Draw_Tool="Draw Tool",
    Annotations="Annotations",
    Play="Play",
    Pause="Pause",
    Go_Back="Go Back"
}

enum AnatomyHindiLanguageEnums{
    Preferences='प्राथमिकता',
    Overview="अवलोकन",
    Languages="भाषाएं",
    Preference_Content="प्राथमिकताएँ आपको इस सिमुलेशन की भाषा बदलने की अनुमति देती हैं। तदनुसार सिमुलेशन का उपयोग करने के लिए अपनी पसंदीदा भाषा चुनें।",
    Rotate='घुमाएँ',
    Pan="पेन करें",
    Reset="रीसेट करें",
    Draw_Tool="ड्रा टूल",
    Annotations="एनोटेशन",
    Play="चालू करें",
    Pause="रोकें",
    Go_Back="वापस जायें",
}
interface LanguageParams {
    key: string;
    LanguageId: string;
}

export const getLanguageEnumByKeyForAnatomyModel = ({ key, LanguageId }: LanguageParams): string => {
    if (LanguageId === 'hi') {
        return (AnatomyHindiLanguageEnums as any)[key] || key;
    } else {
        return (AnatomyEnglishLanguageEnums as any)[key] || key;
    }
};