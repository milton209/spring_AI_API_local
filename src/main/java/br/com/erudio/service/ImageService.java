package br.com.erudio.service;

import org.springframework.ai.image.ImageResponse;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

    //private final ImageModel imageModel;

     public ImageService() {}

    public ImageResponse generateImage(String prompt,
                                       String quality,
                                       Integer N,
                                       Integer height,
                                       Integer width) {

        org.springframework.ai.image.Image image = new org.springframework.ai.image.Image("https://example.com/mock-image.png", null);
        org.springframework.ai.image.ImageGeneration gen = new org.springframework.ai.image.ImageGeneration(image);
        ImageResponse imageResponse = new ImageResponse(java.util.List.of(gen));
        return imageResponse;
    }
}