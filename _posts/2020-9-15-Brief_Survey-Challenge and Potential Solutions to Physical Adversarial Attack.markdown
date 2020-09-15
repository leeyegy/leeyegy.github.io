[Challenge and Potential Solutions to Physical Adversarial Attack: a Brief Survey]()
>**key words:** Physical Adversarial Attack, Face Recognition, Image Classification, Road Sign, Object Detection, Person Detection

## CHALLENGE
The challenges we may face while attacking in real world can be roughly divided into two category: ***Hareware Limitation*** (e.g., camera, printer, etc.), ***Environmental Variability*** (e.g., distance and angle of the viewing camera, brightness, random noise, contrast, rotation, translation, etc. ) and ***Transferability***.

> **Perturbation's Printability**

The range of colors that devices such as printers and screens can reproduce (the color gamut) is only a subset of the RGB space. Hence, to successfully attack in physical world, adversarial perturbations should be mostly of colors reproducible by the printer.

***Potential Solution:***  
* [NPS](#t2)
* [Color Transformer](#t1)

> **Cameras' Limitation**

Due to sampling noise, extreme differences between adjacent pixels in the perturbation are unlikely to be accurately captured by cameras. Consequently, perturbations that are non-smooth may not be physically realizable.

***Potential Solution:***  
* [total variation (TV)](#t3)

> **Environmental Variability**

Adversarial examples for neural networks do not consistently fool neural network classifiers in the physical world due to a combination of viewpoint shifts, camera noise, and other natural transformations, limiting their relevance to real-world systems. 

***Potential Solution:***  
* [Expectation over Transformation(EoT)](#t4)
* [Robust Physical Perturbations (RP2)](#t6)

>**Transferability**

In real world, black-box attack might be the most likely scenario we will handle. Unlike digital space, the transferability of adversarial attacks largely drops in the physical environment, thus we consider a ***physical ensemble attack***.

***Potential Solution:***  

* [Min-max optimization framework](#t5)

## RELATED TERMs/TECHs

><span id="t1">**COLOR TRANSFORMER**</span>

COLOR TRANSFORMER is firstly introduced by [[1]](#r1). The authors argue that the non-smoothness of [NPS](#t2) makes optimization for the adversarial T-shirt difficult. 

They propose to model the color transformer tcolor using a ***multilayer perception (MLP)*** of 2 hidden layers, each of which contains 256 and 512 neurons.

As shown in the following Figure, the authors generate the training dataset to map a digital color palette to the same one printed on a T-shirt. With the aid of 960 color cell pairs, the authors learn the weights of MLP by minimizing the mean squared error of the predicted physical color (with the digital color in Figure (a) as input) and the ground-truth physical color provided in Figure (b). 
<div style="align: center">
<img src="https://img-blog.csdnimg.cn/2020091515131360.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxNjgwNg==,size_16,color_FFFFFF,t_70#pic_center"/>
</div>

COLOR TRANSFORMER is offen incorporated into the final optimization so as to make sure the final perturbations can be printed out accurately as many as possible.

><span id="t2">**NPS (non-printability score)**</span>

NPS is firstly introduced by [[2]](#r1).

Let P be the set of printable RGB triplets. NPS of a pixel ˆp can be defined as:

<div style="align: center">
<img src="https://img-blog.csdnimg.cn/2020091515203026.png#pic_center"/>
</div>

If ˆp belongs to P, or if it is close to some p ∈ P, then NPS $(p)$ will be low. Otherwise, NPS$(p)$ will be high.

NPS is offen incorporated into the final optimization so as to make sure the final perturbations can be printed out accurately as many as possible.


><span id="t3">**Total Variation (TV)**</span>

Total Variation (TV) is  utilized by [[2]](#r1).
For a perturbation r, TV$(r)$ is defined as:

<div style="align: center">
<img src="https://img-blog.csdnimg.cn/2020091515370519.png#pic_center"/>
</div>

where r(i,j) are is a pixel in r at coordinates (i, j). TV $(r)$ is low when the values of adjacent pixels are close to each other (i.e., the perturbation is smooth), and high otherwise.

TV is offen incorporated into the final optimization so as to make sure the final perturbation is smooth.

><span id="t4">**Expectation over Transformation(EoT)**</span>
 
 In [[5]](#5), a so-called ***Expectation over Transformation (EoT) framework*** was proposed to synthesize adversarial examples robust to a set of physical transformations such as ***rotation***, ***translation***, ***contrast***, ***brightness***, and ***random noise***.

The optimization problem can be formulated as follows:
<div style="align: center">
<img src="https://img-blog.csdnimg.cn/20200915155540439.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxNjgwNg==,size_16,color_FFFFFF,t_70#pic_center"/>
</div>

In practice, ***the distribution T*** can model perceptual distortions such as random rotation, translation, or addition of noise.

EoT is offen incorporated into the final optimization so as to make sure the final perturbation is robust to noise, distortion, and affine transformation.

><span id="t5">**Min-max optimization for fooling multiple object detectors**</span>

It's introduced by [[1]](#r1) to improve the transferability of adversarial attacks in the physical environment of object detection. 

Given N object detectors associated with attack loss functions {fi}, the physical ensemble attack is cast as: 

<div style="align: center">
<img src="https://img-blog.csdnimg.cn/20200915161652280.png#pic_center"/>
</div>


where w are known as domain weights that adjust the importance of each object detector during the attack generation, P is a probabilistic simplex, $\gamma$ is a regularization parameter, $\phi$ can be view as loss function, and g is the total-variation norm that enhances perturbations’ smoothness.

><span id="t6">**Robust Physical Perturbations (RP2)**</span>

To generate robust adversarial perturbations under different physical conditions, [[4]](#r4) proposes a general attack algorithm, Robust Physical Perturbations (RP2).

Concurrent work [[5]](#r5) only applies a set of transformation functions to synthetically sample such a distribution. However, modeling physical phenomena is complex and such synthetic transformations may miss physical effects. Therefore, to better capture the effects of changing physical conditions, the authors argue that ***generating experimental data should contains actural physical condition variability as well as synthetic transformations***.

The final robust spatially-constrained perturbation generated by RP2 is optimized as:

<div style="align: center">
<img src="https://img-blog.csdnimg.cn/20200915163702599.png#pic_center"/>
</div>

where function Ti(·) denotes the alignment function that maps transformations on the object to transformations on the perturbation, M means mask matrix, J denotes loss function.

## EXISTING ATTACK SCENARIOs
>**Face Detection**

see [[2]](#r2)

>**Object/Person Detection**

see [[1]](#r1), [[3]](#r3), [[6]](#r6), [[7]](#r7)

>**Road Sign Classification**

see [[4]](#r4)

***NOTICE: Part of the description of related papers in this blog is simply borrowed from the original papers.***

## REFERENCE
<span id="r1">[[1] Adversarial T-shirt! Evading Person Detectors in A Physical World](https://arxiv.org/abs/1910.11099)</span>

<span id="r2">[[2] Accessorize to a Crime: Real and Stealthy Attacks on State-of-the-Art Face Recognition](https://dl.acm.org/doi/10.1145/2976749.2978392)</span>

<span id="r3">[[3] Physical Adversarial Examples for Object Detectors](https://arxiv.org/abs/1807.07769)</span>

<span id="r4">[[4] Robust Physical-World Attacks on Deep Learning Visual Classification](https://openaccess.thecvf.com/content_cvpr_2018/html/Eykholt_Robust_Physical-World_Attacks_CVPR_2018_paper)</span>

<span id="r5">[[5] Synthesizing Robust Adversarial Examples](https://arxiv.org/abs/1707.07397)</span>

<span id="r6">[[6] Fooling automated surveillance cameras: adversarial patches to attack person detection](https://arxiv.org/abs/1904.08653)</span>

<span id="r7">[[7] ShapeShifter: Robust Physical Adversarial Attack on Faster R-CNN Object Detector](https://arxiv.org/abs/1804.05810)</span>




