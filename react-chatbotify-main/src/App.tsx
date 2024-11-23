import { useState } from "react";
import ChatBot from "./components/ChatBot";
import { Flow } from "./types/Flow";
import { Params } from "./types/Params";

function App() {
	const [name, setName] = useState("")

	// Serves as an example flow used during the development phase - covers all possible attributes in a block.
	// restore to default state before running selenium tests (or update the test cases if necessary)!
	const flow: Flow = {
		start: {
			message: "Hello! What is your name?",
			path: "show_name",
		},
		show_name : {
			message: (params: Params) => `Hey ${params.userInput}! Nice to meet you.`,
			function: (params: Params) => setName(params.userInput),
			transition: {duration: 1000},
			path: "ask_token",
		},
		ask_token: {
			message: () => "Before we proceed, we need to verify your profile id, "
			+ "Enter your 6 digit profile id",
			isSensitive: true,
			path: (params: Params) => {
				if (params.userInput.length !== 6) {
					return "incorrect_answer"
				} else {
					return "ask_age_group";
				}
			},
		},
		ask_age_group: {
			message: () => `Hey ${name}!, Your account got verified, May i know your age group???`,
			options: ["child", "teen", "adult"],
			chatDisabled: true,
			path: () => "ask_math_question",
		},
		ask_math_question: {
			message: (params: Params) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return `I see you're a ${params.userInput}. Let's do a quick test! What is 1 + 1?`
			},
			path: (params: Params) => {
				if (params.userInput != "2") {
					return "incorrect_answer"
				} else {
					return "ask_account_services";
				}
			},
		},
		ask_account_services: {
			message: "Great Job! Account Services ?",
			options: ["Balance Enquiry", "Pre-Approved Offers"],
			path: (params: Params) => {
				if (params.userInput != "Balance Enquiry") {
					return "ask_pre_approved_offers"
				} else {
					return "ask_bal_enq";
				}
			},
			//path: "ask_bal_enq"
		},
		ask_bal_enq: {
			message: "Here are the details of your active accounts:"+
			"1) For account XXXXXXXXXX5851"+ 
			"Available Balance is INR 629.54 "+
			"Unclear Balance is INR 0.00"+
			"Do you have any further queries regarding your Balance Enquiry",
			options: ["Yes", "No"],
			path: (params: Params) => {
				if (params.userInput != "Yes") {
					return "ask_pre_approved_offers"
				} else {
					return "ask_bal_enq1";
				}
			},
			//path: "ask_favourite_pet"
		},
		ask_bal_enq1: {
			message: " Kindly provide more details for better assistance",
			options: ["Yes", "No"],
			path: (params: Params) => {
				if (params.userInput != "Yes") {
					return "ask_pre_approved_offers"
				} else {
					return "ask_bal_enq";
				}
			},
			//path: "ask_favourite_pet"
		},
		ask_loan_services: {
			message: "Great Job! Loan Services ?",
			options: ["New Loan", "Existing Loan"],
			path: (params: Params) => {
				if (params.userInput != "New Loan") {
					return "ask_existing_loan"
				} else {
					return "ask_new_loan";
				}
			},
		},
		ask_existing_loan: {
			message: "Existing Loan amount is INR 15000.45. Do you want clear the due amount ?",
			options: ["Yes", "No"],
			path: (params: Params) => {
				if (params.userInput != "Yes") {
					return "ask_existing_loan"
				} else {
					return "ask_clear_loan_due_amount";
				}
			},
		},
		ask_clear_loan_due_amount: {
			message: "Plese use your UPI or Netbanking to pay the due amount",
			options: ["Yes", "No"],
			path: (params: Params) => {
				if (params.userInput != "Yes") {
					return "ask_existing_loan"
				} else {
					return "ask_clear_loan_due_amount";
				}
			},
		},
		ask_new_loan: {
			message: "Wow! There are few offers with your. Home loan is being offered you with 6.75%"+
			" Top-up loan is being offer you with 8.00% ?",
			options: ["Home Loan", "Top-Up Loan"],
			path: (params: Params) => {
				if (params.userInput != "Home Loan") {
					return "ask_existing_loan"
				} else {
					return "ask_new_loan";
				}
			},
		},
		ask_creditcard_offers: {
			message: "Great Job! Credit Card Services ?",
			options: ["Upgrade credit card", "Existing card offers"],
			path: (params: Params) => {
				if (params.userInput == "Upgrade credit card") {
					return "ask_update_creditcard"
				} else {
					return "ask_new_loan";
				}
			},
		},
		ask_update_creditcard: {
			message: "Upgrade amount! Credit Card Services ?",
			options: ["Upgrade credit card to 1 Lakh", "Upgrade credit card to 2 Lakh","Other amount"],
			path: (params: Params) => {
				if (params.userInput == "Upgrade credit card to 1 Lakh") {
					return "ask_existing_loan"
				} else if (params.userInput == "Upgrade credit card to 2 Lakh") {
					return "ask_existing_loan";
				}
				else
				{
					return "ask_existing_loan";
				}
			},
		},
		ask_pre_approved_offers: {
			message: "Sorry! Currently you do not have any pre-approved offers."+
			"Would you like to apply for any products",
			//path: "ask_favourite_pet"
			options: ["Yes", "No"],
			path: (params: Params) => {
				if (params.userInput != "Yes") {
					return "ask_pre_approved_offers"
				} else {
					return "ask_offers";
				}
			},
		},
		ask_offers: {
			message: "To apply for any products of our bank the following:"+
			"1. Please click below to apply for a insta saving account abc/123"+
			"2. Please click below to apply for a credit card abc/456"+
			"3. Please click below to apply for a loan abc/4566"+
			"Is there anything else i can help you",
			//path: "ask_favourite_pet"
			options: ["1", "2","3"],
			path: (params: Params) => {
				if (params.userInput == "1") {
					return "ask_insta_saving_account"
				} else if (params.userInput == "2") {
					return "ask_creditcard_offers";
				}
				else{
					return "ask_loan_offers";
				}
			},
		},
		ask_favourite_color: {
			message: "Great Job! What is your favourite color?",
			path: "ask_favourite_pet"
		},
		ask_favourite_pet: {
			message: "Interesting! Pick any 2 pets below.",
			checkboxes: {items: ["Dog", "Cat", "Rabbit", "Hamster"], min:2, max: 2},
			function: (params: Params) => alert(`You picked: ${JSON.stringify(params.userInput)}!`),
			chatDisabled: true,
			path: "ask_height",
		},
		ask_height: {
			message: "What is your height (cm)?",
			path: async (params: Params) => {
				if (isNaN(Number(params.userInput))) {
					await params.injectMessage("Height needs to be a number!");
					return;
				}
				return "ask_weather";
			}
		},
		ask_weather: {
			message: (params: Params) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return "What's my favourite color? Click the button below to find out my answer!"
			},
			component: (
				<div style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					marginTop: 10
				}}>
					<button 
						className="secret-fav-color"
						onClick={() => alert("black")}>
						Click me!
					</button>
				</div>
			),
			path: async (params: Params) => {
				if (params.userInput.toLowerCase() != "black") {
					return "incorrect_answer"
				} else {
					await params.openChat(false);
					return "close_chat";
				}
			},
		},
		close_chat: {
			message: "I went into hiding but you found me! Ok tell me, "+
				"<b class='bold'>what's your favourite food?</b>",
			path: "ask_image"
		},
		ask_image: {
			message: (params: Params) => `${params.userInput}? Interesting. Could you share an image of that?`,
			file: (params: Params) => console.log(params.files),
			path: "end"
		},
		end: {
			message: "Thank you for sharing! See you again!",
			path: "loop"
		},
		loop: {
			message: (params: Params) => {
				// sends the message half a second later to facilitate testing of new message prompt
				setTimeout(async () => {
					await params.injectMessage("You have reached the end of the conversation!");
				}, 500)
			},
			path: "loop"
		},
		incorrect_answer: {
			message: "Your answer is incorrect, try again!",
			transition: {duration: 0},
			path: (params: Params) => params.prevPath
		},
	}

	return (
		<div className="App">
			<header className="App-header">
				<div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: `calc(20vh)`}}>
					<ChatBot
						id="chatbot-id"
						flow={flow}
						settings={{
							audio: {disabled: false},
							chatInput: {botDelay: 1000},
							userBubble: {showAvatar: true, dangerouslySetInnerHtml: true},
							botBubble: {showAvatar: true, dangerouslySetInnerHtml: true},
							voice: {disabled: false},
							sensitiveInput: {asterisksCount: 6},
						}}
					></ChatBot>
				</div>
			</header>
		</div>
	);
}

export default App;