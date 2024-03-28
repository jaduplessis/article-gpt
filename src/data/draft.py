

text = """### **Introduction**
- Slack is popular communication platform adopted by much of tech community
- Can be extended through use of apps and integrations
- Apps can be built custom using the Bolt framework and hosted with a serverless backend
- Automated emails, while functional, may not engage effectively compared to direct alerts.
- Custom app examples could include automated internal ops procedures, interactive alerts, translation bots.
- Can  link bots to LLMs

  
- Serverless is awesome. Scale to zero, automatic scaling and cost optimisation
- The AWS Cloud Development Kit (CDK) simplifies cloud resource deployment for developers.
- CDK operates like blueprints for constructing buildings, translating project ideas into cloud services.
- Infrastructure-as-code (IAC) streamlines cloud infrastructure design, deployment, and management."
{
  "event": "- Slack is popular communication platform adopted by much of tech community\n- Can be extended through use of apps and integrations\n- Apps can be built custom using the Bolt framework and hosted with a serverless backend\n- Automated emails, while functional, may not engage effectively compared to direct alerts.\n- Custom app examples could include automated internal ops procedures, interactive alerts, translation bots.\n- Can  link bots to LLMs"
}

- Walkthrough of creating a Slack app in the console
- This can forward events on to a CDK deployed serverless backend
- An event bus can be used like a nervous system to forward events to lambdas that carry out actions
- Two example events are explored: a message event and a reaction event
  1. responding to channel messages with translated responses 
  2. rendering a basic homepage
- These examples provide frameworks for host of other applications
"""