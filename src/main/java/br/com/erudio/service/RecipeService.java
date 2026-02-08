package br.com.erudio.service;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RecipeService {

    private final ChatModel chatModel;

    public RecipeService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String createRecipe(String ingredients,
                               String cuisine,
                               String diataryRestrictions){

        var template = """
                I Want to create a recipe using the following ingredients: {ingredients}
                The cuisine type i prefer is {cuisine}.
                please consider the following diatery restriction: {diataryRestrictions}.
                Please provide me with a detailed rercipe including title , list of ingridients , and cooking instructions
                """;
        PromptTemplate promptTemplate = new PromptTemplate(template);
        Map<String , Object> params = Map.of(
                "ingredients", ingredients,
                "cuisine", cuisine,
                "diataryRestrictions", diataryRestrictions

        );

        Prompt prompt = promptTemplate.create(params);

        return chatModel.call(prompt).getResult().getOutput().getText();
    }
}















































































































