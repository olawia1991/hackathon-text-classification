import {
  DetectSyntaxRequest,
  Entity,
  KeyPhrase,
  SyntaxToken,
  DominantLanguage
} from 'aws-sdk/clients/comprehend';
import { comprehend, translate} from './aws';

const SYNTAX_FILTERS = ['VERB', 'PROPN', 'NOUN'];
const ENTITY_FILTERS = ['PERSON', 'LOCATION', 'ORGANIZATION', 'TITLE'];
const INVALID_VERB = ['is', 'are', 'am'];

type TextResultItem = SyntaxToken | Entity | KeyPhrase;


const isEnglishLanguage = async (text: string) => {
  const { Languages } = await comprehend.detectDominantLanguage({   Text: text}).promise();
  if (!Languages) {
    return false;
  }

  const englishUsed =  Languages.filter((language: DominantLanguage) => {
    const { LanguageCode } = language;
    return LanguageCode === 'eng';
  });

  return englishUsed.length > 0;
};


const getKeyPhrases = async (params: DetectSyntaxRequest) => {
  const { KeyPhrases } = await comprehend.detectKeyPhrases(params).promise();

  if (!KeyPhrases) {
    return [];
  }

  return KeyPhrases.filter((phrase: KeyPhrase) => {
    const { Score, Text } = phrase;
    const matchRequiredScore = Score && Score > 0.99;
    const isValidVerbs = !INVALID_VERB.includes(Text || '');

    return matchRequiredScore && isValidVerbs;
  });
};

const getSyntax = async (params: DetectSyntaxRequest) => {
  const { SyntaxTokens } = await comprehend.detectSyntax(params).promise();

  if (!SyntaxTokens) {
    return [];
  }

  return SyntaxTokens.filter((token: SyntaxToken) => {
    const { PartOfSpeech, Text } = token;
    if (!PartOfSpeech) {
      return false;
    }
    const { Tag, Score } = PartOfSpeech;

    const matchRequiredScore = Score && Score > 0.9;
    const matchRequiredTag = Tag && SYNTAX_FILTERS.includes(Tag);
    const isValidVerbs = !INVALID_VERB.includes(Text || '');

    return matchRequiredScore && matchRequiredTag && isValidVerbs;
  });
};

const getEntities = async (params: DetectSyntaxRequest) => {
  const { Entities } = await comprehend.detectEntities(params).promise();

  if (!Entities) {
    return [];
  }

  return Entities.filter((entity: Entity) => {
    const { Type, Score, Text } = entity;

    const matchRequiredScore = Score && Score > 0.9;
    const matchRequiredTag = Type && ENTITY_FILTERS.includes(Type);
    const isValidVerbs = !INVALID_VERB.includes(Text || '');

    return matchRequiredScore && matchRequiredTag && isValidVerbs;
  });
};

const getResult = async (
  searchFn: (params: DetectSyntaxRequest) => Promise<TextResultItem[]>,
  params: DetectSyntaxRequest
): Promise<string[]> =>
  (await searchFn(params)).map((f: TextResultItem) => f.Text || '');

const getTranslation = async (text: string): Promise<string> =>{
  const translateParams = {
    "Text": text,
    "SourceLanguageCode": "auto",
    "TargetLanguageCode": "en"
  }
  const translationResponse =  await translate.translateText(translateParams).promise();
  return translationResponse ? translationResponse.TranslatedText : text;
}

export const getTagsForText = async (text: string, type = 'syntax') => {
  //Translate to English if dominant language is not English.
  const isEnglish = await isEnglishLanguage(text)
  if (!isEnglish){
      text = await getTranslation(text);
  }

  const params = {
    LanguageCode: 'en',
    Text: text,
  };

  const syntax = await getResult(getSyntax, params);
  const entities = await getResult(getEntities, params);
  const phrases = await getResult(getKeyPhrases, params);

  switch (type) {
    case 'combine':
      return Array.from(new Set(entities.concat(phrases).concat(syntax)));
    case 'entity':
      return entities;
    case 'keyphrase':
      return phrases;
    default:
      return syntax;
  }
};
