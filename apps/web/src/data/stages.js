export const STAGES = [
  {
    id: 1,
    name: "Opening",
    shortName: "Opening",
    purpose: "Reach the right person and say who you are. The prospect decides in the first ten seconds whether this call is worth a minute.",
    sheMaySay: [
      "Who is this and what is it regarding?",
      "I am driving right now / heading into a meeting.",
      "Mr. Rao no longer works with this firm."
    ],
    outcomes: [
      "Reached the right person",
      "Gatekeeper / reception answered",
      "Person unavailable (busy, driving, meeting)",
      "Wrong number / person left company"
    ]
  },
  {
    id: 2,
    name: "Purpose",
    shortName: "Purpose",
    purpose: "Say in one or two sentences why you called, in words the prospect can repeat to a colleague. A purpose they cannot repeat is a purpose they did not hear.",
    sheMaySay: [
      "Where did you get my number from?",
      "Is this a sales call?",
      "What exactly does your company do?"
    ],
    outcomes: [
      "Asked what we do",
      "Asked where we got the number",
      "Said it is a sales call",
      "Let me go on"
    ]
  },
  {
    id: 3,
    name: "Permission",
    shortName: "Permission",
    purpose: "Find out whether they are willing to talk now. A clear yes, a clear no, or a time to call back are all good outcomes. Talking on without one is not.",
    sheMaySay: [
      "Call me after two / tomorrow.",
      "Send it on WhatsApp first.",
      "I have two minutes, tell me quickly."
    ],
    outcomes: [
      "Gave permission to talk now",
      "Asked to call back later",
      "Asked to send info first (WhatsApp/email)",
      "Did not answer clearly"
    ]
  },
  {
    id: 4,
    name: "Their business",
    shortName: "Their business",
    purpose: "Ask about their company and their work before saying anything about yours. People talk about what they do; they rarely listen to what you do.",
    sheMaySay: [
      "We don't manufacture, we only distribute.",
      "We have three branches across Hyderabad.",
      "Tell me about your product first."
    ],
    outcomes: [
      "Described their business",
      "Corrected my assumption",
      "Asked about us first",
      "Gave a one-line answer"
    ]
  },
  {
    id: 5,
    name: "Their need, in their words",
    shortName: "Their need",
    purpose: "Hear what they are trying to do or struggling with, in their own words. This is the one stage where the caller writes down exactly what was said.",
    sheMaySay: [
      "Our plant is operating at 60% capacity.",
      "We struggle with billing delays across clinics.",
      "Everything is running fine right now, no problems."
    ],
    outcomes: [
      "Named a specific goal or need",
      "Said everything is fine",
      "Asked what we can do for them",
      "Did not share a need"
    ]
  },
  {
    id: 6,
    name: "Objection",
    shortName: "Objection",
    purpose: "Hear the reason for a no and understand it. A reason you understand can be answered on this call or the next; a reason you talked over cannot.",
    sheMaySay: [
      "We already have an agency / software for this.",
      "Speak to my partner / purchase manager.",
      "We don't have budget for this right now."
    ],
    outcomes: [
      "Already have a provider / consultant",
      "Not the right person / redirected",
      "Asked for written information",
      "Not interested / no budget"
    ]
  },
  {
    id: 7,
    name: "Next step",
    shortName: "Next step",
    purpose: "Agree one concrete thing: a document on WhatsApp or email, a call at a named time, a meeting. One thing, named, with a time or a channel.",
    sheMaySay: [
      "Send me a PDF on WhatsApp and I will look at it.",
      "Call me Tuesday at 3:00 PM.",
      "Talk to our operations lead, here is his number."
    ],
    outcomes: [
      "Agreed to receive a document",
      "Set a specific time for next call",
      "Referred to a colleague",
      "No commitment made"
    ]
  },
  {
    id: 8,
    name: "Close",
    shortName: "Close",
    purpose: "End the call clearly and record what happened: the outcome, the next step, and the prospect's words from stage 5. The record is what the next call is built on.",
    sheMaySay: [
      "Thanks, looking forward to the message.",
      "Okay, speak soon.",
      "[Call dropped / disconnected]"
    ],
    outcomes: [
      "Call ended with agreed next step",
      "Warm goodbye, no next step",
      "Call dropped / hung up",
      "Need to follow up later"
    ]
  }
];

export const FINAL_OUTCOMES = [
  { value: "agreed_to_receive_report", label: "Agreed to receive report / info" },
  { value: "next_step_agreed", label: "Next call / meeting agreed" },
  { value: "interested", label: "Interested / in discovery" },
  { value: "follow_up", label: "Follow up later" },
  { value: "call_again", label: "Call dropped / call again" },
  { value: "not_interested", label: "Not interested" },
  { value: "do_not_call", label: "Do not call" },
  { value: "wrong_person", label: "Wrong person / referred" },
  { value: "moved_company", label: "Moved company / left organization" }
];

// Historical outcome taxonomy from the 100-transcript archive (includes logging omissions)
export const SOURCE_ARCHIVE_OUTCOMES = [
  ...FINAL_OUTCOMES,
  { value: "not_logged", label: "Unrecorded / Not logged in CRM (source dataset)" }
];

export const getOutcomeLabel = (outcomeValue) => {
  if (!outcomeValue) return "Unrecorded / In Progress";
  if (outcomeValue === "not_logged") return "Unrecorded / Not Logged";
  const found = SOURCE_ARCHIVE_OUTCOMES.find(o => o.value === outcomeValue);
  return found ? found.label : outcomeValue.replace(/_/g, " ");
};


