// screens/PSQIScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Helper function to convert time string (e.g., "22:30") to minutes from midnight
const timeToMinutes = (timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// PSQI Questions and their corresponding options and scoring logic
const psqiQuestions = [
  {
    id: 'Q1',
    text: 'Dalam 1 bulan terakhir, jam berapa biasanya Anda pergi tidur malam? (Contoh: 22:30)',
    type: 'time',
  },
  {
    id: 'Q2',
    text: 'Dalam 1 bulan terakhir, berapa lama (dalam menit) biasanya waktu yang Anda butuhkan untuk tertidur setiap malam?',
    type: 'options',
    options: [
      { text: '< 15 menit', value: 0 },
      { text: '16-30 menit', value: 1 },
      { text: '31-60 menit', value: 2 },
      { text: '> 60 menit', value: 3 },
    ],
    component: 'C2a',
  },
  {
    id: 'Q3',
    text: 'Dalam 1 bulan terakhir, jam berapa biasanya Anda bangun tidur di pagi hari? (Contoh: 06:00)',
    type: 'time',
  },
  {
    id: 'Q4',
    text: 'Dalam 1 bulan terakhir, berapa jam Anda benar-benar tidur setiap malam? (Ini mungkin berbeda dengan jumlah jam yang Anda habiskan di tempat tidur.)',
    type: 'options',
    options: [
      { text: '> 7 jam', value: 0 },
      { text: '6-7 jam', value: 1 },
      { text: '5-6 jam', value: 2 },
      { text: '< 5 jam', value: 3 },
    ],
    component: 'C3',
  },
  {
    id: 'Q5a',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Tidak bisa tertidur dalam 30 menit?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C2b',
  },
  {
    id: 'Q5b',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Bangun di tengah malam atau dini hari?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
  },
  {
    id: 'Q5c',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Harus pergi ke kamar mandi?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
  },
  {
    id: 'Q5d',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Tidak bisa bernapas dengan nyaman?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
  },
  {
    id: 'Q5e',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Batuk atau mendengkur keras?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
  },
  {
    id: 'Q5f',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Merasa terlalu dingin?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
  },
  {
    id: 'Q5g',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Merasa terlalu panas?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
  },
  {
    id: 'Q5h',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Mengalami mimpi buruk?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
  },
  {
    id: 'Q5i',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Nyeri?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
  },
  {
    id: 'Q5j',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami kesulitan tidur karena: Alasan lain?',
    type: 'options-with-text',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C5_part',
    placeholder: 'Silakan jelaskan alasan lain...',
  },
  {
    id: 'Q6',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda minum obat (yang diresepkan atau yang dijual bebas) untuk membantu Anda tidur?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C6',
  },
  {
    id: 'Q7',
    text: 'Dalam 1 bulan terakhir, seberapa sering Anda mengalami masalah untuk tetap terjaga saat mengemudi, makan, atau melakukan aktivitas sosial?',
    type: 'options',
    options: [
      { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
      { text: 'Kurang dari sekali seminggu', value: 1 },
      { text: 'Satu atau dua kali seminggu', value: 2 },
      { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
    ],
    component: 'C7a',
  },
  {
    id: 'Q8',
    text: 'Dalam 1 bulan terakhir, seberapa besar masalahnya bagi Anda untuk mempertahankan semangat yang cukup untuk menyelesaikan sesuatu?',
    type: 'options',
    options: [
      { text: 'Tidak ada masalah sama sekali', value: 0 },
      { text: 'Hanya masalah yang sangat sedikit', value: 1 },
      { text: 'Agak menjadi masalah', value: 2 },
      { text: 'Masalah yang sangat besar', value: 3 },
    ],
    component: 'C7b',
  },
  {
    id: 'Q9',
    text: 'Dalam 1 bulan terakhir, bagaimana Anda menilai kualitas tidur Anda secara keseluruhan?',
    type: 'options',
    options: [
      { text: 'Sangat baik', value: 0 },
      { text: 'Cukup baik', value: 1 },
      { text: 'Cukup buruk', value: 2 },
      { text: 'Sangat buruk', value: 3 },
    ],
    component: 'C1',
  },
  {
    id: 'Q10_has_partner',
    text: 'Dalam 1 bulan terakhir, apakah Anda memiliki pasangan di tempat tidur atau teman sekamar?',
    type: 'options',
    options: [
      { text: 'Tidak punya pasangan di tempat tidur atau teman sekamar', value: 'no_partner' },
      { text: 'Pasangan/teman sekamar di ruangan lain', value: 'partner_other_room' },
      { text: 'Pasangan di ruangan yang sama tetapi tidak satu ranjang', value: 'partner_same_room_diff_bed' },
      { text: 'Pasangan di ranjang yang sama', value: 'partner_same_bed' },
    ],
    component: null,
    conditionalQuestions: [
      {
        id: 'Q10a',
        text: 'Seberapa sering orang tersebut memperhatikan Anda mendengkur keras?',
        type: 'options',
        options: [
          { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
          { text: 'Kurang dari sekali seminggu', value: 1 },
          { text: 'Satu atau dua kali seminggu', value: 2 },
          { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
        ],
        component: null,
      },
      {
        id: 'Q10b',
        text: 'Seberapa sering orang tersebut memperhatikan Anda jeda panjang di antara napas saat tidur?',
        type: 'options',
        options: [
          { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
          { text: 'Kurang dari sekali seminggu', value: 1 },
          { text: 'Satu atau dua kali seminggu', value: 2 },
          { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
        ],
        component: null,
      },
      {
        id: 'Q10c',
        text: 'Seberapa sering orang tersebut memperhatikan Anda kaki berkedut atau menyentak saat tidur?',
        type: 'options',
        options: [
          { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
          { text: 'Kurang dari sekali seminggu', value: 1 },
          { text: 'Satu atau dua kali seminggu', value: 2 },
          { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
        ],
        component: null,
      },
      {
        id: 'Q10d',
        text: 'Seberapa sering orang tersebut memperhatikan Anda episode disorientasi atau kebingungan saat tidur?',
        type: 'options',
        options: [
          { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
          { text: 'Kurang dari sekali seminggu', value: 1 },
          { text: 'Satu atau dua kali seminggu', value: 2 },
          { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
        ],
        component: null,
      },
      {
        id: 'Q10e',
        text: 'Seberapa sering orang tersebut memperhatikan Anda kegelisahan lain saat tidur? Silakan jelaskan:',
        type: 'options-with-text',
        options: [
          { text: 'Tidak pernah dalam 1 bulan terakhir', value: 0 },
          { text: 'Kurang dari sekali seminggu', value: 1 },
          { text: 'Satu atau dua kali seminggu', value: 2 },
          { text: 'Tiga kali atau lebih dalam seminggu', value: 3 },
        ],
        component: null,
        placeholder: 'Silakan jelaskan kegelisahan lainnya...',
      },
    ]
  },
];


// Function to get category and advice based on PSQI Global Score
const getPsqiCategoryAndAdvice = (score) => {
  if (score <= 5) {
    return { category: 'Kualitas Tidur \nBaik', advice: 'Anda memiliki kualitas tidur yang baik. Pertahankan kebiasaan tidur sehat Anda!' };
  } else if (score >= 6 && score <= 10) {
    return { category: 'Kualitas Tidur \nCukup Baik', advice: 'Kualitas tidur Anda menunjukkan gangguan ringan. Pertimbangkan untuk meningkatkan kebiasaan tidur Anda.' };
  } else if (score >= 11 && score <= 15) {
    return { category: 'Kualitas Tidur \nBuruk', advice: 'Kualitas tidur Anda terganggu sedang. Perhatikan pola tidur Anda dan pertimbangkan konsultasi jika berlanjut.' };
  } else {
    return { category: 'Kualitas Tidur \nSangat Buruk', advice: 'Kualitas tidur Anda sangat terganggu. Sangat disarankan untuk mencari saran profesional terkait tidur.' };
  }
};


export default function PSQIScreen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState(null);

  const [showQ10SubQuestions, setShowQ10SubQuestions] = useState(false);
  const [q10SubQuestionIndex, setQ10SubQuestionIndex] = useState(0);

  const isQ10ParentQuestion = psqiQuestions[currentQuestionIndex] && psqiQuestions[currentQuestionIndex].id === 'Q10_has_partner';

  // Determine current question to render
  const currentQuestion = isQ10ParentQuestion && showQ10SubQuestions
    ? psqiQuestions[currentQuestionIndex].conditionalQuestions[q10SubQuestionIndex]
    : psqiQuestions[currentQuestionIndex];


  useEffect(() => {
    // Only update currentInput if currentQuestion is not undefined (i.e., not past the end)
    if (currentQuestion) {
      const questionId = currentQuestion.id;
      setCurrentInput(answers[questionId] !== undefined ? answers[questionId] : null);
    }
  }, [currentQuestionIndex, q10SubQuestionIndex, answers, currentQuestion]);


  const handleSelectOption = (optionValue) => {
    setCurrentInput(optionValue);
    // This is the correct way to update state based on previous state
    setAnswers(prevAnswers => { // <--- prevAnswers is correctly passed here by React
      const newAnswers = {
        ...prevAnswers,
        [currentQuestion.id]: optionValue,
      };

      // Special logic for Q10_has_partner to handle cancellation
      if (currentQuestion.id === 'Q10_has_partner') {
        if (optionValue === 'no_partner') {
          // If "no_partner" selected, clear sub-answers
          const q10ConditionalQuestions = psqiQuestions[currentQuestionIndex].conditionalQuestions;
          q10ConditionalQuestions.forEach(q => {
            delete newAnswers[q.id]; // Delete directly from newAnswers
            if (q.type === 'options-with-text') {
              delete newAnswers[`${q.id}_text`];
            }
          });
          setShowQ10SubQuestions(false);
          setQ10SubQuestionIndex(0);
        } else {
          // If they select an option that requires sub-questions, ensure they are shown
          setShowQ10SubQuestions(true);
          setQ10SubQuestionIndex(0);
        }
      }
      return newAnswers; // Return the updated state
    });
  };

  const handleTextInput = (text) => {
    setCurrentInput(text);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestion.id]: text,
    }));
  };

  const calculatePsqiScore = () => {
    let componentScores = {
      C1: 0,
      C2: 0,
      C3: 0,
      C4: 0,
      C5: 0,
      C6: 0,
      C7: 0,
    };

    // Component 1: Subjective Sleep Quality (Q9)
    if (answers['Q9'] !== undefined) {
      componentScores.C1 = answers['Q9'];
    }

    // Component 2: Sleep Latency (Q2 and Q5a)
    let q2Subscore = answers['Q2'] !== undefined ? answers['Q2'] : 0;
    let q5aSubscore = answers['Q5a'] !== undefined ? answers['Q5a'] : 0;
    let sumQ2Q5a = q2Subscore + q5aSubscore;

    if (sumQ2Q5a === 0) componentScores.C2 = 0;
    else if (sumQ2Q5a >= 1 && sumQ2Q5a <= 2) componentScores.C2 = 1;
    else if (sumQ2Q5a >= 3 && sumQ2Q5a <= 4) componentScores.C2 = 2;
    else if (sumQ2Q5a >= 5 && sumQ2Q5a <= 6) componentScores.C2 = 3;

    // Component 3: Sleep Duration (Q4)
    if (answers['Q4'] !== undefined) {
      componentScores.C3 = answers['Q4'];
    }

    // Component 4: Habitual Sleep Efficiency (Q1, Q3, Q4)
    const bedtimeMinutes = timeToMinutes(answers['Q1']);
    const wakeupTimeMinutes = timeToMinutes(answers['Q3']);
    const q4Score = answers['Q4']; // This is the score from Q4
    let actualSleepHours;

    // Convert Q4 score back to estimated hours for calculation
    if (q4Score === 0) actualSleepHours = 7.5; // > 7 hours
    else if (q4Score === 1) actualSleepHours = 6.5; // 6-7 hours
    else if (q4Score === 2) actualSleepHours = 5.5; // 5-6 hours
    else if (q4Score === 3) actualSleepHours = 4.5; // < 5 hours
    else actualSleepHours = 0; // Fallback

    let hoursInBed = 0;
    if (bedtimeMinutes !== null && wakeupTimeMinutes !== null) {
      if (wakeupTimeMinutes > bedtimeMinutes) {
        hoursInBed = (wakeupTimeMinutes - bedtimeMinutes) / 60;
      } else {
        // Across midnight
        hoursInBed = (24 * 60 - bedtimeMinutes + wakeupTimeMinutes) / 60;
      }
    }

    let sleepEfficiency = 0;
    if (hoursInBed > 0) {
      sleepEfficiency = (actualSleepHours / hoursInBed) * 100;
    }

    if (sleepEfficiency > 85) componentScores.C4 = 0;
    else if (sleepEfficiency >= 75 && sleepEfficiency <= 85) componentScores.C4 = 1;
    else if (sleepEfficiency >= 65 && sleepEfficiency <= 74) componentScores.C4 = 2;
    else if (sleepEfficiency < 65) componentScores.C4 = 3;


    // Component 5: Sleep Disturbances (Sum of Q5b-j scores)
    let disturbancesSum = 0;
    const disturbanceQuestionIds = ['Q5b', 'Q5c', 'Q5d', 'Q5e', 'Q5f', 'Q5g', 'Q5h', 'Q5i', 'Q5j'];
    disturbanceQuestionIds.forEach(qId => {
      if (answers[qId] !== undefined && typeof answers[qId] === 'number') {
        disturbancesSum += answers[qId];
      }
    });
    if (disturbancesSum === 0) componentScores.C5 = 0;
    else if (disturbancesSum >= 1 && disturbancesSum <= 9) componentScores.C5 = 1;
    else if (disturbancesSum >= 10 && disturbancesSum <= 18) componentScores.C5 = 2;
    else if (disturbancesSum >= 19 && disturbancesSum <= 27) componentScores.C5 = 3;

    // Component 6: Use of Sleeping Medication (Q6)
    if (answers['Q6'] !== undefined) {
      componentScores.C6 = answers['Q6'];
    }

    // Component 7: Daytime Dysfunction (Q7 and Q8)
    let q7Subscore = answers['Q7'] !== undefined ? answers['Q7'] : 0;
    let q8Subscore = answers['Q8'] !== undefined ? answers['Q8'] : 0;
    let sumQ7Q8 = q7Subscore + q8Subscore;

    if (sumQ7Q8 === 0) componentScores.C7 = 0;
    else if (sumQ7Q8 >= 1 && sumQ7Q8 <= 2) componentScores.C7 = 1;
    else if (sumQ7Q8 >= 3 && sumQ7Q8 <= 4) componentScores.C7 = 2;
    else if (sumQ7Q8 >= 5 && sumQ7Q8 <= 6) componentScores.C7 = 3;

    const globalScore = Object.values(componentScores).reduce((sum, val) => sum + val, 0);
    return globalScore;
  };

  const handleLanjutkan = () => {
    // Validate current question's answer
    const currentQuestionObject = psqiQuestions[currentQuestionIndex];
    let isAnswered = false;

    // Handle conditional Q10 sub-questions
    if (isQ10ParentQuestion && showQ10SubQuestions) {
      const subQuestion = currentQuestionObject.conditionalQuestions[q10SubQuestionIndex];
      isAnswered = answers[subQuestion.id] !== undefined && answers[subQuestion.id] !== null;
      if (subQuestion.type === 'options-with-text' && answers[subQuestion.id] === 3) {
        if (!answers[`${subQuestion.id}_text`] || answers[`${subQuestion.id}_text`].trim() === '') {
          isAnswered = false; // Require text input if option '3' is selected
        }
      }
    } else {
      // Handle regular questions
      isAnswered = answers[currentQuestionObject.id] !== undefined && answers[currentQuestionObject.id] !== null;
      if (currentQuestionObject.type === 'options-with-text' && answers[currentQuestionObject.id] === 3) {
        if (!answers[`${currentQuestionObject.id}_text`] || answers[`${currentQuestionObject.id}_text`].trim() === '') {
          isAnswered = false; // Require text input if option '3' is selected
        }
      } else if (currentQuestionObject.type === 'time' && (!answers[currentQuestionObject.id] || !/^\d{2}:\d{2}$/.test(answers[currentQuestionObject.id]))) {
        isAnswered = false; // Require HH:MM format for time inputs
      }
    }

    if (!isAnswered) {
      Alert.alert("Pilihan Dibutuhkan", "Silakan pilih salah satu opsi atau isi teks/format waktu dengan benar sebelum melanjutkan.");
      return;
    }

    // Progression logic for Q10 conditional flow
    if (isQ10ParentQuestion) {
      if (answers[currentQuestionObject.id] === 'no_partner') {
        // If "no_partner" selected, directly move past all Q10 logic
        // This will make `currentQuestionIndex` point to beyond the array if Q10 was last.
        setCurrentQuestionIndex(psqiQuestions.length); // Move past Q10
      } else if (showQ10SubQuestions) {
        // If showing sub-questions, check if there are more
        if (q10SubQuestionIndex < currentQuestionObject.conditionalQuestions.length - 1) {
          setQ10SubQuestionIndex(q10SubQuestionIndex + 1);
          return; // Stay on Q10 parent, but move to next sub-question
        } else {
          // All Q10 sub-questions answered, move to next main question
          setShowQ10SubQuestions(false); // Hide sub-questions
          setQ10SubQuestionIndex(0); // Reset for next time
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } else {
        // If Q10_has_partner selected 'yes' but sub-questions not started
        setShowQ10SubQuestions(true);
        setQ10SubQuestionIndex(0);
        return;
      }
    }

    // Original logic for moving to next question or results
    // This part should only execute if not handled by Q10 specific logic above
    if (currentQuestionIndex < psqiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions (including Q10 sub-questions if applicable) are answered
      const score = calculatePsqiScore();
      const { category, advice } = getPsqiCategoryAndAdvice(score);

      navigation.navigate('PSQIResult', {
        score,
        category,
        advice,
        answers: answers,
      });
    }
  };


  const handleKembali = () => {
    if (isQ10ParentQuestion && showQ10SubQuestions && q10SubQuestionIndex > 0) {
      // Go back to previous Q10 sub-question
      setQ10SubQuestionIndex(q10SubQuestionIndex - 1);
    } else if (isQ10ParentQuestion && showQ10SubQuestions && q10SubQuestionIndex === 0) {
      // If at first Q10 sub-question, go back to Q10 parent selection
      setShowQ10SubQuestions(false);
      // currentInput will be updated by useEffect
    } else if (currentQuestionIndex > 0) {
      // Go back to previous main question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // If previous question was Q10 and user said 'yes', re-show sub-questions
      const prevQuestion = psqiQuestions[currentQuestionIndex - 1];
      if (prevQuestion && prevQuestion.id === 'Q10_has_partner' && answers['Q10_has_partner'] !== 'no_partner') {
        setShowQ10SubQuestions(true);
        // Set Q10 sub-question index to its last answered position or 0
        const q10ConditionalQuestions = prevQuestion.conditionalQuestions;
        let lastAnsweredSubQIndex = 0;
        for (let i = q10ConditionalQuestions.length - 1; i >= 0; i--) {
          if (answers[q10ConditionalQuestions[i].id] !== undefined) {
            lastAnsweredSubQIndex = i;
            break;
          }
        }
        setQ10SubQuestionIndex(lastAnsweredSubQIndex);
      }
    } else {
      navigation.goBack(); // Go back to previous screen if on the very first question
    }
  };

  // Calculate progress based on main questions, and conditionally for Q10 sub-questions
  const totalMainQuestions = psqiQuestions.length;
  const totalQ10SubQuestions = (psqiQuestions[totalMainQuestions - 1].conditionalQuestions || []).length;
  let totalTrackedQuestions = totalMainQuestions;
  let answeredCountForProgress = Object.keys(answers).filter(key => answers[key] !== null).length;

  if (answers['Q10_has_partner'] === 'no_partner') {
      // If "no_partner" was selected, we treat Q10 as answered and its sub-questions are skipped.
      totalTrackedQuestions = totalMainQuestions - totalQ10SubQuestions + 1; // Main Qs minus Q10 subs plus Q10 parent itself
      // Ensure answeredCountForProgress doesn't count Q10 sub-questions if they were previously answered but now skipped
      Object.keys(answers).forEach(key => {
        if (key.startsWith('Q10') && key !== 'Q10_has_partner' && answers['Q10_has_partner'] === 'no_partner') {
          answeredCountForProgress--;
        }
      });
  } else if (answers['Q10_has_partner'] && answers['Q10_has_partner'] !== 'no_partner') {
      // If Q10 parent is answered 'yes', include sub-questions in total.
      totalTrackedQuestions = totalMainQuestions + totalQ10SubQuestions - 1; // All main Qs + Q10 sub Qs - Q10 parent itself
  }


  const progress = (answeredCountForProgress / totalTrackedQuestions) * 100;

  // IMPORTANT: Ensure currentQuestion is defined before accessing its properties in render
  if (!currentQuestion) {
      // This state means all questions are answered, and we are about to navigate.
      // Or, an error occurred in logic, preventing currentQuestion from being set.
      // We can render a loading/blank screen or directly navigate if we are sure all questions are done.
      // In this case, the `handleLanjutkan` logic should prevent reaching this state
      // if all questions aren't truly answered before navigating.
      // For now, return null to prevent error, or a simple placeholder.
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text>Menyiapkan hasil...</Text>
          </View>
        </SafeAreaView>
      );
  }


  const renderQuestionContent = () => {
    if (currentQuestion.type === 'options' || currentQuestion.type === 'options-with-text') {
      return (
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                currentInput === option.value && styles.optionItemSelected
              ]}
              onPress={() => handleSelectOption(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  currentInput === option.value && styles.optionTextSelected
                ]}
              >
                {option.text}
              </Text>
              <View
                style={[
                  styles.checkboxBase,
                  currentInput === option.value && styles.checkboxChecked
                ]}
              >
                {currentInput === option.value && (
                  <Icon name="check" size={16} color="#508E82" />
                )}
              </View>
            </TouchableOpacity>
          ))}
          {currentQuestion.type === 'options-with-text' && currentInput === 3 && (
            <TextInput
              style={styles.textInput}
              placeholder={currentQuestion.placeholder}
              placeholderTextColor="#9E9E9E"
              value={answers[`${currentQuestion.id}_text`] || ''}
              onChangeText={(text) => setAnswers(prev => ({ ...prev, [`${currentQuestion.id}_text`]: text }))}
              multiline
              maxLength={250}
            />
          )}
        </View>
      );
    } else if (currentQuestion.type === 'time') {
      return (
        <TextInput
          style={styles.timeInput}
          placeholder="HH:MM (Contoh: 22:30)"
          placeholderTextColor="#9E9E9E"
          keyboardType="numbers-and-punctuation"
          value={currentInput || ''}
          onChangeText={handleTextInput}
          maxLength={5}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleKembali} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarInner, { width: `${progress}%` }]} />
          </View>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.questionText}>{currentQuestion.text}</Text>

          {renderQuestionContent()}

          <View style={styles.spacer} />

        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              (currentInput === null ||
               (currentQuestion.type === 'options-with-text' && currentInput === 3 && (!answers[`${currentQuestion.id}_text`] || answers[`${currentQuestion.id}_text`].trim() === '')) ||
               (currentQuestion.type === 'time' && (!currentInput || !/^\d{2}:\d{2}$/.test(currentInput)))) &&
              styles.disabledButton
            ]}
            onPress={handleLanjutkan}
            disabled={
              currentInput === null ||
              (currentQuestion.type === 'options-with-text' && currentInput === 3 && (!answers[`${currentQuestion.id}_text`] || answers[`${currentQuestion.id}_text`].trim() === '')) ||
              (currentQuestion.type === 'time' && (!currentInput || !/^\d{2}:\d{2}$/.test(currentInput)))
            }
          >
            <Text style={styles.actionButtonText}>
              {currentQuestionIndex === psqiQuestions.length - 1 && (!isQ10ParentQuestion || (isQ10ParentQuestion && answers['Q10_has_partner'] === 'no_partner') || (isQ10ParentQuestion && showQ10SubQuestions && q10SubQuestionIndex === psqiQuestions[currentQuestionIndex].conditionalQuestions.length - 1))
                ? 'Lihat Hasil'
                : 'Lanjutkan'}
            </Text>
            <Icon name="arrow-right" size={20} color="white" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F4F6F8',
  },
  backButton: {
    padding: 5,
  },
  progressBarOuter: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: '#00695C',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 30,
    lineHeight: 30,
  },
  optionsContainer: {
    // No specific styles needed, child items are styled
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionItemSelected: {
    backgroundColor: '#00695C',
    borderColor: '#00695C',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#B0BEC5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 10,
    fontSize: 16,
    color: '#333333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  timeInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  spacer: {
    flex: 1,
  },
  bottomButtonContainer: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: '#F4F6F8',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    backgroundColor: '#00695C',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom:10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
});