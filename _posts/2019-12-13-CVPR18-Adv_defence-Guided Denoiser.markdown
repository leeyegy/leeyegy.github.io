---
layout: post
title: CVPR18-ADV_DEFENCE-Guided Denoiser
date: 2019-12-13 16:63:24.000000000 +09:00
---


## PAPER INFO
[Defense Against Adversarial Attacks Using High-Level Representation Guided Denoiser](https://arxiv.org/abs/1712.02976)
[Source Code](https://github.com/lfz/Guided-Denoise)

>**key words:** adversarial defence, guided denoiser, change loss function, U-net, ladder network

## OVERVIEW
### What's the main concern of this paper?
>**Statement one:**

Using denoiser to defend which is to constraint the difference between the l-th representations of target model (e.g., ResNet) activated by clean data $x$ and denoised data $\hat{x}$. 

>**Statement two:**

defend by change loss function in order to bypass the amplification effect of adversarial noise.

### What's the main idea/contribution?

>Net architecture

|Model Name|Intro|Key Words|
|---|---|---|
|DUNET (denoising U-net)|modify DAE with U-net and proposed the DUNET|ladder net,<br>lateral connection, <br>residual learning|
> Denoiser

|Model Name|Intro| Type|
|---|---|---|
|PGD (pixel guided denoiser)|amplification effect;<br>loss function is defined at the level of **image pixels**|unsupervised|
|HGD (high-level representation guided denoiser)|alleviate amplification effect,<br>loss function is defined at the level of** high-level layer's feature maps** |unsupervised|
|CGD (class label guided denoiser)|use classification loss function as denoising loss function|supervised|

>HGD

|Model Name|Intro|Key Words|
|---|---|---|
|FGD (feature guided denoiser)|also known as **perceptual loss** or **feature matching loss**|l=-2, the direct output of** the final conv_layer**|
|LGD (logits guided denoiser)| |l=-1, the output of the layer before the final softmax function|

### How does it perform(Experiment)?
### Anything improvable or eye-opening?

## DETAILS
