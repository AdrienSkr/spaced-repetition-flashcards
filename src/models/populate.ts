import { db } from './db'
import { getDefaultSM2Data } from '../utils/sm2'
import { devLog } from '../utils/devMode'

export async function populate() {
  devLog.log('Debut de la fonction populate')

  // vérifier si la bd possède deja une liste
  const nbLists = await db.lists.count()
  let listId: number | undefined

  if (nbLists && nbLists > 0) {
    // si la bd possède déjà une liste
    // on récupère la première liste
    listId = (await db.lists.toArray())[0]?.id
  } else {
    // on doit créer une liste
    listId = await db.lists.add({
      title: 'Test0',
    })
  }
  const listId2 = await db.lists.add({
    title: 'Test',
  })

  const listId3 = await db.lists.add({
    title: 'Transformers & Attention Mechanisms',
  })

  if (listId === undefined || listId2 === undefined || listId3 === undefined) {
    throw new Error("La liste n'a pas pu être créée ou récupérée.")
  }

  // Ajout manuel de données
  const cardsData = [
    {
      question: "Who is the protagonist of the anime 'Naruto'?",
      answer: 'Naruto Uzumaki',
      listId: listId,
    },
    {
      question: "What is the name of the pirate crew in 'One Piece'?",
      answer: 'Straw Hat Pirates',
      listId: listId,
    },
    {
      question: "In 'Dragon Ball Z', who is Goku's first child?",
      answer: 'Gohan',
      listId: listId,
    },
    {
      question: "What is the name of the academy in 'My Hero Academia'?",
      answer: 'U.A. High School',
      listId: listId,
    },
    {
      question: "Who is the main antagonist in the 'Death Note' series?",
      answer: 'L',
      listId: listId,
    },
    {
      question:
        "What is the name of the titan shifter that Eren Yeager possesses in 'Attack on Titan'?",
      answer: 'Attack Titan',
      listId: listId,
    },
    {
      question: 'Which anime features a shinigami named Ryuk?',
      answer: 'Death Note',
      listId: listId,
    },
    {
      question: "What is the magical power system called in 'Fairy Tail'?",
      answer: 'Magic',
      listId: listId,
    },
    {
      question: "Who is the captain of the 11th Division in 'Bleach'?",
      answer: 'Kenpachi Zaraki',
      listId: listId,
    },
    {
      question:
        "In 'Sword Art Online', what is the name of the virtual world where players are trapped?",
      answer: 'Aincrad',
      listId: listId,
    },
    {
      question: "Who is the creator of the 'Fullmetal Alchemist' manga?",
      answer: 'Hiromu Arakawa',
      listId: listId,
    },
    {
      question:
        "What is the ultimate technique used by Goku in 'Dragon Ball Z'?",
      answer: 'Kamehameha',
      listId: listId,
    },
    {
      question: 'Which anime features a girl named Madoka Kaname?',
      answer: 'Puella Magi Madoka Magica',
      listId: listId,
    },
    {
      question:
        "What is the name of the cursed finger that Yuji Itadori swallows in 'Jujutsu Kaisen'?",
      answer: "Sukuna's Finger",
      listId: listId,
    },
    {
      question: "In 'One Piece', what is Luffy's signature attack?",
      answer: 'Gomu Gomu no Pistol',
      listId: listId,
    },
    {
      question: "Who is known as the 'Hero of the Hidden Leaf' in 'Naruto'?",
      answer: 'Minato Namikaze',
      listId: listId,
    },
    {
      question:
        "What is the name of the notebook that kills anyone whose name is written in it in 'Death Note'?",
      answer: 'Death Note',
      listId: listId,
    },
    {
      question:
        'Which anime features giant humanoid creatures that eat humans?',
      answer: 'Attack on Titan',
      listId: listId,
    },
    {
      question:
        "What is the goal of the Homunculi in 'Fullmetal Alchemist: Brotherhood'?",
      answer: "To create the Philosopher's Stone",
      listId: listId,
    },
    {
      question: "Who is the main female character in 'Sword Art Online'?",
      answer: 'Asuna',
      listId: listId,
    },
    {
      question: 'Which anime features the character Edward Elric?',
      answer: 'Fullmetal Alchemist',
      listId: listId,
    },
    {
      question: "In 'Naruto', what is the name of Naruto's signature jutsu?",
      answer: 'Rasengan',
      listId: listId,
    },
    {
      question:
        "Which anime features the deadly 'Kira' who uses a notebook to kill?",
      answer: 'Death Note',
      listId: listId,
    },
    {
      question: "Who is the main protagonist in 'Attack on Titan'?",
      answer: 'Eren Yeager',
      listId: listId,
    },
    {
      question: "In 'My Hero Academia', what is Izuku Midoriya's hero name?",
      answer: 'Deku',
      listId: listId,
    },
    {
      question: "What is the full name of the anime 'SAO'?",
      answer: 'Sword Art Online',
      listId: listId,
    },
    {
      question:
        'Which anime features a young ninja who seeks to become the Hokage?',
      answer: 'Naruto',
      listId: listId,
    },
    {
      question: 'What is the name of the demon fox sealed inside Naruto?',
      answer: 'Kurama',
      listId: listId,
    },
    {
      question: "Who is the captain of the Black Bulls in 'Black Clover'?",
      answer: 'Yami Sukehiro',
      listId: listId,
    },
    {
      question:
        "Which anime features characters using 'Nen' as a power system?",
      answer: 'Hunter x Hunter',
      listId: listId,
    },
    {
      question: "In 'One Piece', what fruit did Luffy eat?",
      answer: 'Gomu Gomu no Mi',
      listId: listId,
    },
    {
      question: 'Who is the strongest of the Seven Deadly Sins?',
      answer: 'Meliodas',
      listId: listId,
    },
    {
      question: "What is the main goal of Light Yagami in 'Death Note'?",
      answer: 'To create a new world where he is God',
      listId: listId,
    },
    {
      question: "Who is the main character in 'Bleach'?",
      answer: 'Ichigo Kurosaki',
      listId: listId,
    },
    {
      question: 'Which anime features a boy who wants to be the Wizard King?',
      answer: 'Black Clover',
      listId: listId,
    },
    {
      question:
        "In 'Dragon Ball', what are the mystical orbs that can grant wishes?",
      answer: 'Dragon Balls',
      listId: listId,
    },
    {
      question: "What is the goal of the 'Akatsuki' group in 'Naruto'?",
      answer: 'To capture all the Tailed Beasts',
      listId: listId,
    },
    {
      question:
        'Which anime features a group of teenagers fighting evil witches in a parallel world?',
      answer: 'Puella Magi Madoka Magica',
      listId: listId,
    },
    {
      question: "Who is the author of 'One Piece'?",
      answer: 'Eiichiro Oda',
      listId: listId,
    },
    {
      question:
        "What is the main power used by characters in 'Jujutsu Kaisen'?",
      answer: 'Cursed Energy',
      listId: listId,
    },
    {
      question: "Who is the main character in 'Tokyo Ghoul'?",
      answer: 'Ken Kaneki',
      listId: listId,
    },
    {
      question:
        "In 'Attack on Titan', what is the name of the city where the story begins?",
      answer: 'Shiganshina District',
      listId: listId,
    },
    {
      question: "What is the goal of Gon Freecss in 'Hunter x Hunter'?",
      answer: 'To find his father',
      listId: listId,
    },
    {
      question: "Which anime features a guild called 'Fairy Tail'?",
      answer: 'Fairy Tail',
      listId: listId,
    },
    {
      question: 'Who is the rival of Ash Ketchum in the Pokémon series?',
      answer: 'Gary Oak',
      listId: listId,
    },
    {
      question: "In 'Naruto', who is the leader of the Akatsuki?",
      answer: 'Pain',
      listId: listId,
    },
    {
      question:
        'Which anime features a high school student turned soul reaper?',
      answer: 'Bleach',
      listId: listId,
    },
    {
      question: "Who is the alchemist known as the 'Fullmetal Alchemist'?",
      answer: 'Edward Elric',
      listId: listId,
    },
    {
      question:
        "What is the name of the alternate dimension in 'Naruto' where Kaguya can send people?",
      answer: 'Kamui Dimension',
      listId: listId,
    },
    {
      question:
        'Which anime features a hero society where 80% of the population has superpowers?',
      answer: 'My Hero Academia',
      listId: listId,
    },
    {
      question:
        "Who is the main character in 'Demon Slayer: Kimetsu no Yaiba'?",
      answer: 'Tanjiro Kamado',
      listId: listId,
    },
    {
      question: "What is the name of Luffy's brother who is also a pirate?",
      answer: 'Portgas D. Ace',
      listId: listId,
    },
    {
      question: "Who is the captain of the 1st Division in 'Bleach'?",
      answer: 'Genryūsai Shigekuni Yamamoto',
      listId: listId2,
    },
    {
      question: "In 'Dragon Ball Z', who is Vegeta's father?",
      answer: 'King Vegeta',
      listId: listId2,
    },
    {
      question:
        "What is the name of the school where the students in 'Assassination Classroom' study?",
      answer: 'Kunugigaoka Junior High School',
      listId: listId2,
    },
    {
      question: "Who is the main character in 'Naruto'?",
      answer: 'Naruto Uzumaki',
      listId: listId2,
    },
    {
      question: 'Which anime features a detective named Conan?',
      answer: 'Detective Conan',
      listId: listId2,
    },
    {
      question:
        "What is the full name of the character 'Light' in 'Death Note'?",
      answer: 'Light Yagami',
      listId: listId2,
    },
    {
      question:
        "In 'Attack on Titan', what is the name of the Titan that Reiner Braun can transform into?",
      answer: 'Armored Titan',
      listId: listId2,
    },
    {
      question: 'Which anime features a vampire hunter named D?',
      answer: 'Vampire Hunter D',
      listId: listId2,
    },
    {
      question: "Who is the main antagonist in the 'Naruto Shippuden' series?",
      answer: 'Madara Uchiha',
      listId: listId2,
    },
    {
      question: "In 'Dragon Ball', who is the wife of Vegeta?",
      answer: 'Bulma',
      listId: listId2,
    },
    {
      question:
        "What is the name of the organization that opposes the Survey Corps in 'Attack on Titan'?",
      answer: 'The Marleyan Warriors',
      listId: listId2,
    },
    {
      question: "Who is the mentor of Gon in 'Hunter x Hunter'?",
      answer: 'Kite',
      listId: listId2,
    },
    {
      question:
        "Which anime features a group of girls who form a school idol group called 'μ's'?",
      answer: 'Love Live!',
      listId: listId2,
    },
    {
      question:
        "In 'Naruto', what is the name of the village where Naruto was born?",
      answer: 'Konohagakure (Hidden Leaf Village)',
      listId: listId2,
    },
    {
      question: "Who is the author of 'Naruto'?",
      answer: 'Masashi Kishimoto',
      listId: listId2,
    },
    {
      question:
        "What is the name of the main female protagonist in 'Sailor Moon'?",
      answer: 'Usagi Tsukino',
      listId: listId2,
    },
    {
      question: 'Which anime features an alchemist named Roy Mustang?',
      answer: 'Fullmetal Alchemist',
      listId: listId2,
    },
    {
      question: "Who is the rival of Light Yagami in 'Death Note'?",
      answer: 'L',
      listId: listId2,
    },
    {
      question: "In 'Dragon Ball Z', who is Goku's father?",
      answer: 'Bardock',
      listId: listId2,
    },
    {
      question:
        "Which anime features characters playing a deadly game called 'SAO'?",
      answer: 'Sword Art Online',
      listId: listId2,
    },
    {
      question:
        "What is the name of the creature that lives inside Ichigo Kurosaki in 'Bleach'?",
      answer: 'Hollow',
      listId: listId2,
    },
    {
      question:
        "In 'One Piece', what is the name of Luffy's sword-wielding crewmate?",
      answer: 'Roronoa Zoro',
      listId: listId2,
    },
    {
      question: "Who is the main character in 'Hunter x Hunter'?",
      answer: 'Gon Freecss',
      listId: listId2,
    },
    {
      question:
        "Which anime features a group of assassins known as the 'Phantom Troupe'?",
      answer: 'Hunter x Hunter',
      listId: listId2,
    },
    {
      question: "Who is the leader of the Survey Corps in 'Attack on Titan'?",
      answer: 'Erwin Smith',
      listId: listId2,
    },
    {
      question: "In 'Naruto', who is the father of Sasuke Uchiha?",
      answer: 'Fugaku Uchiha',
      listId: listId2,
    },
    {
      question:
        "What is the name of the main antagonist in 'Dragon Ball Z' who turns people into chocolate?",
      answer: 'Majin Buu',
      listId: listId2,
    },
    {
      question:
        'Which anime features a high school student who turns into a ghoul?',
      answer: 'Tokyo Ghoul',
      listId: listId2,
    },
    {
      question: "Who is the main character in 'One Punch Man'?",
      answer: 'Saitama',
      listId: listId2,
    },
    {
      question:
        "What is the name of the main female character in 'Sword Art Online'?",
      answer: 'Asuna Yuuki',
      listId: listId2,
    },
    {
      question:
        'Which anime features a character who can transform into a giant with immense power?',
      answer: 'Attack on Titan',
      listId: listId2,
    },
    {
      question: "Who is the main character in 'Death Note'?",
      answer: 'Light Yagami',
      listId: listId2,
    },
    {
      question:
        "In 'Naruto', what is the name of the technique used by Kakashi Hatake?",
      answer: 'Chidori',
      listId: listId2,
    },
    {
      question:
        "What is the goal of Edward and Alphonse Elric in 'Fullmetal Alchemist'?",
      answer: "To find the Philosopher's Stone",
      listId: listId2,
    },
    {
      question: 'Which anime features the character Shoto Todoroki?',
      answer: 'My Hero Academia',
      listId: listId2,
    },
    {
      question:
        "In 'One Piece', what is the ultimate treasure that everyone seeks?",
      answer: 'One Piece',
      listId: listId2,
    },
    {
      question: "Who is the leader of Team 7 in 'Naruto'?",
      answer: 'Kakashi Hatake',
      listId: listId2,
    },
    {
      question: "Which anime features a cursed sword named 'Murasame'?",
      answer: 'Akame ga Kill!',
      listId: listId2,
    },
    {
      question:
        "What is the name of the ultimate power-up form that Goku achieves in 'Dragon Ball Z'?",
      answer: 'Super Saiyan',
      listId: listId2,
    },
    {
      question: "In 'Attack on Titan', who is the female Titan?",
      answer: 'Annie Leonhart',
      listId: listId2,
    },
    {
      question:
        'Which anime features a young boy training to become the strongest hunter?',
      answer: 'Hunter x Hunter',
      listId: listId2,
    },
    {
      question: "What is the name of the main character in 'One Piece'?",
      answer: 'Monkey D. Luffy',
      listId: listId2,
    },
    {
      question: "In 'Naruto', who is Naruto's mentor?",
      answer: 'Jiraiya',
      listId: listId2,
    },
    {
      question:
        "Which anime features a character who can manipulate time using a 'Geass'?",
      answer: 'Code Geass',
      listId: listId2,
    },
    {
      question: "Who is the protagonist of 'Black Clover'?",
      answer: 'Asta',
      listId: listId2,
    },
    {
      question:
        "What is the name of the deadly exam that Gon takes in 'Hunter x Hunter'?",
      answer: 'Hunter Exam',
      listId: listId2,
    },
    {
      question:
        "In 'Naruto', what is the name of the technique used by Itachi Uchiha to trap enemies in illusions?",
      answer: 'Tsukuyomi',
      listId: listId2,
    },
    {
      question: 'Which anime features a character with a straw hat?',
      answer: 'One Piece',
      listId: listId2,
    },
    {
      question: "Who is the main character in 'Fairy Tail'?",
      answer: 'Natsu Dragneel',
      listId: listId2,
    },
    // AI Transformers cards
    {
      question: 'What is the primary innovation of the Transformer architecture introduced in the "Attention is All You Need" paper?',
      answer: 'The replacement of recurrent layers with self-attention mechanisms, allowing for parallel processing of sequences and better handling of long-range dependencies.',
      listId: listId3,
    },
    {
      question: 'In the multi-head attention mechanism, what is the purpose of using multiple attention heads instead of a single attention function?',
      answer: 'Multiple heads allow the model to jointly attend to information from different representation subspaces at different positions, capturing diverse aspects of relationships between tokens.',
      listId: listId3,
    },
    {
      question: 'What are the three main components computed in the scaled dot-product attention mechanism, and what role does each play?',
      answer: 'Query (Q), Key (K), and Value (V). Queries and Keys are used to compute attention weights (similarity scores), and these weights are applied to Values to produce the weighted output.',
      listId: listId3,
    },
    {
      question: 'Why is the attention score divided by the square root of the dimension (√d_k) in scaled dot-product attention?',
      answer: 'To prevent the dot products from growing too large in magnitude, which would push the softmax function into regions with extremely small gradients, making training difficult.',
      listId: listId3,
    },
  ]

  // Ajouter les propriétés SM-2 à chaque carte
  const cardsWithSM2 = cardsData.map(card => ({
    ...card,
    ...getDefaultSM2Data(),
  }))

  await db.cards.bulkAdd(cardsWithSM2)

  devLog.log('Data populated')
}

/*
  let cards: Card[];

  try {
    const response = await fetch('http://localhost:5173/src/models/data.json');
    cards = await response.json();
  } catch (error) {
    console.error('Erreur de Fetch:', error);
    cards = [];
  }

  console.log('Cards JSON:', cards);

  const data = cards.map((e: any) => ({
    question: e.question,
    answer: e.answer,
    listId,
  }));

  await db.cards.bulkAdd(data);
  */

// Fonction pour fetch un JSON
/*
async function fetchJson(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('Data JSON:', data)
    return data
  } catch (error) {
    console.error('Erreur lors du fetch:', error)
    throw error
  }
}
*/
