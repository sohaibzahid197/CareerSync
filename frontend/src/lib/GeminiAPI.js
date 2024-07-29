import {GoogleGenerativeAI} from "@google/generative-ai";
import markdownit from 'markdown-it'
import dotenv from "dotenv";

dotenv.config();

const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    xhtmlOut: true,
    breaks: true,
})

const genAI = new GoogleGenerativeAI("AIzaSyDUJovMPuHUNbW77G3vsDcOdTMbc3d2Ies");

export async function ask(question) {
    const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'})
    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 1000,
        }
    })
    const result = await chat.sendMessage(question)
    const response = await result.response
    console.log(response.text())
    return md.render(response.text())
}

