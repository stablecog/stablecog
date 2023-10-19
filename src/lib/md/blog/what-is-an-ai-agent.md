---
title: What is an AI Agent?
description: Learn about AI agents and how they automate online tasks efficiently using language models for goal setting, task planning, and execution. Learn about AgentGPT, BabyAGI, AIAgent, and more.
author: Matthew Duffin
author_url: https://rareconnections.io
date: 2023-07-08T15:00:00.000Z
tags: AI Agent, Automation, ChatGPT, GPT4, Developers, AI
---

<script>
  import DocImage from '$components/docs/DocImage.svelte'
</script>

> This article has been written by a guest writer: [Matthew Duffin](https://rareconnections.io). If you would like to write a guest post on our blog, please [contact us](https://stablecog.com/contact).

If you’ve ever used ChatGPT you’ll know that while it’s a powerful conversational tool, when it comes to interacting with the online environment, [it’s not much use](https://www.digitaltrends.com/computing/chatgpts-bing-browsing-feature-disabled-over-paywall-flaw/).

That’s where AI Agents come in…

Unlike ChatGPT, AI Agents can interact with the online world and follow instructions to complete tasks.

Once prompted, the AI agent will operate independently in the background to complete the mission, freeing the user up to do other things.

It’s like having a super-efficient personal assistant that helps you get stuff done online!

## How Do AI Agents Work?

AI Agents leverage Large Language Models (LLMs) like [GPT4](https://openai.com/gpt-4) to interpret the user’s needs, and generate a plan of action to complete the task.

An AI Agent is generally a single AI instance that has been empowered to interact with the online environment and complete monotonous tasks like booking flights, finding products, sorting through emails, or doing simple data entry.

But don’t let that fool you into thinking that AI Agents are only limited to simple tasks because, like everything in AI, imagination is the only limit. For example, one user even tried to create an [AI Agent to rule the world](https://decrypt.co/126122/meet-chaos-gpt-ai-tool-destroy-humanity).

Let’s take a closer look at the general workflow of an AI Agent.

<DocImage src="https://ba.stablecog.com/blog/ai-agent-process.png" width="2560" height="1714" alt="A diagram with icons showing the user, the LLM, a list for task planning, and a cloud representing execution. Each icon is connected by an arrow. There is an iteration arrow between the execution and task planning." />

### 1. Goal Setting

The user feeds the desired objective to the AI agent. These are the instructions the AI will use to complete its mission.

### 2. Task Planning

The AI Agent interprets the user’s needs and gets to work processing the request. Based on the goal the AI agent creates a list of tasks that need to be completed. It also determines the sequence in which these tasks should be executed to efficiently achieve the goal.

This is the basic framework the AI uses as it moves onto step 3 of the process.

### 3. Execution

This is the step that sets AI Agents apart from regular Chatbots. With the list of tasks planned out, the AI agent sources data from the internet, exactly how you or I would.

It will find and compare information to determine the best outcome, iterating the original task list as more information becomes available. The AI Agent can add extra goals, modify existing goals, or mark goals as complete.

Once all tasks are complete and the objective is fulfilled, the AI agent's workflow concludes. At this point, it has successfully achieved what it set out to accomplish, and the user can review the output.

Alt text: A diagram with icons showing the user, the LLM, a list for task planning, and a cloud representing execution. Each icon is connected by an arrow. There is an iteration arrow between the execution and task planning.

## How to Get Started With an AI Agent

While AI Agents are a relatively new adaptation of existing LLMs, there are a number of options available for those looking to employ their very own AI assistant.

### 1. AgentGPT

<DocImage src="https://ba.stablecog.com/blog/agent-gpt.png" width="2560" height="2048" href="https://agentgpt.reworkd.ai/" alt="AgentGPT's Website" />

[AgentGPT](https://agentgpt.reworkd.ai/) is a free online tool that runs right in your web browser and is perhaps the easiest way to get going with an AI Agent. AgentGPT features similar capabilities to [AutoGPT](https://stablecog.com/blog/what-is-auto-gpt), but it allows use without a lot of technical knowledge and setup. The downside is that AgentGPT has a bit less capability when compared to AutoGPT.

If you want to quickly get going try AgentGPT in your browser, if you need more functionality then you’ll need to install AutoGPT.

### 2. AutoGPT

<DocImage src="https://ba.stablecog.com/blog/auto-gpt-v2.png" width="2560" height="2560" href="https://github.com/Torantulino/Auto-GPT" alt="AutoGPT's GitHub Repository" />

[AutoGPT](https://github.com/Torantulino/Auto-GPT) is an open-source AI Agent built for GPT3.5 and GPT-4 that allows the user to automate tasks online.

AutoGPT runs locally so some initial setup is required, if you’re not familiar with installing a Github project there are plenty of guides to help with [AutoGPT installation](https://lablab.ai/t/auto-gpt-tutorial-how-to-set-up-auto-gpt).

Once set up, AutoGPT features include internet access, short and long-term memory, file saving, and optional [voice communication](https://beta.elevenlabs.io/speech-synthesis).

You can employ AutoGPT to do a range of tasks like to-do lists, ordering products, completing research, code generation, and email management.

Basically, your imagination is the only limit!

### 3. BabyAGI

<DocImage src="https://ba.stablecog.com/blog/baby-agi.png" width="2560" height="2560" href="https://github.com/yoheinakajima/babyagi" alt="BabyAGI's GitHub Repository" />

BabyAGI is an AI Agent designed to generate and complete tasks given instructions from the user. BabyAGI has the capability to remember and learn from its mistakes which makes it a powerful tool.

BabyAGI can be [run locally](https://github.com/yoheinakajima/babyagi), or used in the [web interface](https://babyagi-ui.vercel.app/). There is also a modified version of BabyAGI known as [BabyDeerAGI](https://replit.com/@YoheiNakajima/BabyDeerAGI), which can run independent parallel tasks and query rewrites.

### 4. Aomni

<DocImage src="https://ba.stablecog.com/blog/aomni.png" width="2560" height="2048" href="https://www.aomni.com/" alt="Aomni's Website" />

[Aomni](https://www.aomni.com/) is an AI Agent designed to act as a research buddy. It takes high-level topics and breaks them down into smaller queries, compiling the information into an overall summary for the user.

What makes Aomni different is that rather than using an LLM to generate the output, it uses an AI to extract and compile the information directly from the source. The compiled summary is also shown with the steps the AI took to compile the information.

This means you don’t have to worry about [hallucinations](https://machinelearningmastery.com/a-gentle-introduction-to-hallucinations-in-large-language-models/) or misinformation from the LLMs, which makes Aomni a great tool for optimizing the academic research process.

### 5. AI Agent

<DocImage src="https://ba.stablecog.com/blog/aiagent.png" width="2560" height="2048" href="https://aiagent.app/" alt="AIAgent's Website" />

[AI Agent](https://aiagent.app/) is a browser-based app that allows you to build a custom agent for completing tasks online. After interpreting the user’s requirements and generating a task list, AI Agent allows modification of the task list before commencing its mission.

The visual workflow builder, which is coming soon, is an intuitive user-friendly interface that allows you to choose from different LLMs, agent architectures, and outputs (text or voice). It’s a really neat implementation of AI Agent technology.

## Limitations of AI Agents

AI Agents are far from flawless. Like ChatGPT, they can struggle with ambiguous or poorly-defined instructions which results in a misunderstanding of the task requirements.

Another limitation is the over-reliance on data. If the information sourced is inaccurate or biased, it can lead to confident outputs which are factually inaccurate, misleading the user.

Privacy and security concerns can arise as these agents access sensitive information online, or are given the power to write and execute code.

You should always exercise caution and ensure that AI agents are deployed carefully and responsibly.

## The Future of AI Agents

Like everything in AI, as time passes these AI Agents will become vastly more sophisticated and capable.

One example of what the future might look like is Microsoft’s Copilot integration into Windows 11. Copilot is a full-time assistant for Windows that is capable of summarizing and rewriting content, adjusting settings, and finding music. Basically, anything you can think of, Copilot will be able to help with.

AI Agents are also likely to be utilized by businesses for completing more specific tasks like analyzing market trends, automating customer relationships, and optimizing supply chains to name a few.

As the technology advances, I would expect AI Agents to become a much more common part of our daily lives.

## Example Use Case: Finding A Gaming Laptop Under $1000

I asked [AI Agent](https://aiagent.app/) to find me a new gaming laptop under $1000.

The agent quickly generated a list of tasks including comparing specs and prices of different laptops, reading reviews, checking for sales and discounts, creating a shortlist, checking the availability, comparing warranty options, and evaluating performance and graphics capabilities! Basically, everything we would do manually when looking for a new laptop.

After I inspected the to-do list, we continued and the agent compiled a shortlist of 10 options for me to choose from. This all took about 2 or 3 minutes, which is incredible.

While I probably wouldn’t fully rely on the agent just yet, it’s a powerful way to save a bunch of time you would normally spend researching.

## Wrapping Up

AI Agents are revolutionizing the way we engage with the online environment and helping to streamline both our personal and business operations.

As they continue to evolve, their capabilities will only improve and expand making them even more effective.

Seizing the opportunities presented by AI Agents is key to enhancing productivity and staying one step ahead as AI progresses.
