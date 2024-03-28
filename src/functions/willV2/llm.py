
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from constants import SETTINGS
from functions.willV2.system import system_message


class WillV2:
  ''' Class to represent the WillV2 language model (will shitspeare)
  
  '''
  def __init__(self):
    ''' Constructor for the WillV2 class
    '''
    self.model = self.start_model()


  def start_model(self):
    ''' Function to start initialise the fine-tuned language model
  
    Returns:
      openai: The language model
    '''
    model = ChatOpenAI(
      api_key=SETTINGS.openai_api_key.get_secret_value(),
      model="ft:gpt-3.5-turbo-0125:aleios:willv2:94uyrpGH",
      temperature=0.75,
      max_tokens=1500,
    )

    return model
  

  def invoke_ft(self, text: str) -> str:
    ''' Function to invoke the language model
    '''    
    
    messages = [
      SystemMessage(
        content=system_message
      ),
      HumanMessage(
        content=text
      )
    ]
    
    response = self.model.invoke(messages).content

    return response
  