
enum SlicerEnglishLanguageEnums{
    Preferences='Preferences',
    Overview="Overview",
    Languages="Languages",
    Save_As = "Save As",
    Name="Name",
    Cancel="Cancel",
    Save_Simulation="Save Simulation",
    Remove_Model="Remove Model",
    Quit_Message="Are you sure, you want to remove the model without saving?",
    Remove="Remove",
    Edit_Annotation="Edit Annotation",
    Title="Title",
    Description="Description",
    Anno_Desc="Annotations description goes here...",
    Save_Edit="Save this Edit",
    Add_Annotation="Add Annotation",
    Add_to_model="Add to model",
    View_All="View All",
    Add_3D_Model="Add 3D Model",
    Add_Model="Add Model",
    Search_Model="Seach 3D Model here",
    Edit="Edit",
    Delete="Delete",
    Pan_Noti="Hold 'Ctrl' button during Pan",
    Save_Success="Successfully saved!",
    Error_Occured="Error Occured",
    Save_Error="Please try saving after sometime",
    Select_Annotation="Select an annotation",
    Rotate="Rotate",
    Pan="Pan",
    Reset="Reset",
    File="File",
    Object_Mode="Object Mode",
    Annotation_Mode="Annotation Mode",
    Title_Error="Please enter a title",
    D_models="3D models",
    Preference_Content="Preferences allow you to change the language of this simulation. Select your preferred language to use the simulation accordingly.",
}

enum SlicerHindiLanguageEnums{
    Preferences='प्राथमिकता',
    Overview="अवलोकन",
    Languages="भाषाएं",
    Save_As ="सहेजें",
    Name="नाम",
    Cancel="रद्द करें",
    Save_Simulation="सिमुलेशन सहेजें",
    Remove_Model="मॉडल हटाएँ",
    Quit_Message="क्या आप वाकई बिना सहेजे मॉडल को हटाना चाहते हैं?",
    Remove="हटायें",
    Edit_Annotation="एनोटेशन संपादित करें",
    Title="शीर्षक",
    Description="विवरण",
    Anno_Desc="एनोटेशन विवरण यहां लिखिए",
    Save_Edit="संपादन सहेजें",
    Add_Annotation="एनोटेशन जोड़ें",
    Add_to_model="मॉडल में जोड़ें",
    View_All="सभी को देखें",
    Add_3D_Model="3D मॉडल जोड़ें",
    Add_Model="मॉडल जोड़ें",
    Search_Model="यहां 3डी मॉडल खोजें",
    Edit="संपादित करें",
    Delete="हटायें",
    Pan_Noti="पैन के दौरान 'Ctrl' बटन दबाए रखें",
    Save_Success="सफलतापूर्वक संचित कर लिया गया है!",
    Error_Occured="त्रुटि हुई",
    Save_Error="कृपया कुछ देर बाद सेव करने का प्रयास करें",
    Select_Annotation="एनोटेशन चुनें",
    Rotate='घुमाएँ',
    Pan="पेन करें",
    Reset="रीसेट करें",
    File="फाइल",
    Object_Mode="ऑब्जेक्ट मोड",
    Annotation_Mode="एनोटेशन मोड",
    Title_Error="कृपया शीर्षक डालें",
    D_models="3डी मॉडल",
    Preference_Content="प्राथमिकताएँ आपको इस सिमुलेशन की भाषा बदलने की अनुमति देती हैं। तदनुसार सिमुलेशन का उपयोग करने के लिए अपनी पसंदीदा भाषा चुनें।",
}
interface LanguageParams {
    key: string;
    LanguageId: string;
}

export const getLanguageEnumByKeyAndLanguage = ({ key, LanguageId }: LanguageParams): string => {
    if (LanguageId === 'hi') {
        return (SlicerHindiLanguageEnums as any)[key] || key;
    } else {
        return (SlicerEnglishLanguageEnums as any)[key] || key;
    }
};