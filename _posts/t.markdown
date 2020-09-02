## PAPER INFO
[Single-step Adversarial training with Dropout Scheduling (CVPR20)](https://openaccess.thecvf.com/content_CVPR_2020/papers/B.S._Single-Step_Adversarial_Training_With_Dropout_Scheduling_CVPR_2020_paper.pdf)

>**key words:** Fast Adversarial Training, single step

## OVERVIEW
### Targeted Problem?
>**Models trained using single-step adversarial training method are pseudo robust**

This pseudo robustness of models is attributed to the **gradient masking**
effect.


### Contribution
>**show that models trained
using single-step adversarial training method learn to prevent the generation of single-step adversaries**

this is due to over-fitting of the model during the initial stages of training.

>**Propose a single-step adversarial training method with dropout scheduling.**

models trained using the proposed single-step adversarial training method are robust against both **single-step** and **multi-step** adversarial attacks, and the performance is on par with models trained using computationally expensive multi-step adversarial training methods.

### Algorithm Details
>**Typical Settings**
 
 Adding dropout layer (typical setting: dropout layer with fixed dropout probability **after FC+ReLU layer**) does not help the model trained using single-step adversarial training method to gain robustness.

>**This Paper's Setting**
 
 Unlike typical setting, we introduce dropout layer after each non-linear layer (i.e., **dropout-2D after conv2D+ReLU**, and **dropout-1D after FC+ReLU**) of the model, and further decay its dropout probability as training progress.

> More details are as follows
> 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200902190155473.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODMxNjgwNg==,size_16,color_FFFFFF,t_70#pic_center)


