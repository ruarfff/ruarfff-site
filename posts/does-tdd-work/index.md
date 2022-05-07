---
title: Does Test Driven Development Work?
date: "2018-09-24"
description: Is it possible to determine if TDD works in a scientific way?
---

## Introduction

[Bertrand Russell](https://en.wikipedia.org/wiki/Bertrand_Russell) was concerned about the issue of having to accept certain axioms to be able to proceed with an education in mathematics even though those axioms had not necessarily been rigorously proven. He treats aspects of this in his book [An Introduction to Mathematical Philosophy](https://people.umass.edu/klement/imp/imp-ebk.pdf). An example that is given in the [In Our Time Episode](http://www.bbc.co.uk/programmes/b01p8fsr) about Bertrand Russell is, for any two points in space there exists a line between those two points. This is intuitive but no proof existed of the truth of it. One major problem with a lack of proof is that, even if something might be intuitive, it is possible to argue that thing is not intuitive to you, or some other answer is more intuitive and there is no proof to appeal to that says an argument is right or wrong.

A question that will be explored in this post is, do we have any proof that Test Driven Development (TDD) works?

What does ‘Work’ mean in this context? Two measurements often used are:

- Productivity
- Code Quality

Does practising TDD mean a real improvement in productivity or code quality? Just measuring productivity or code quality is difficult enough.

In this post, we will look at some of the discussion going on around TDD in the industry and some of the efforts made to evaluate TDD in a scientific way.

## Opinions in Industry

Before we look at scientific studies and data, it's worth going over some well known and subjective discussions around TDD for context.

[Kent Beck](https://en.wikipedia.org/wiki/Kent_Beck) is [credited with having developed or 'rediscovered'](https://en.wikipedia.org/wiki/Test-driven_development) TDD somewhere around 1999. Since then there have been many proponents of TDD and a [multitude of books](https://www.amazon.com/s/ref=nb_sb_ss_i_1_14?url=search-alias%3Dstripbooks&field-keywords=test+driven+development&sprefix=test+driven+de%2Cstripbooks%2C218&crid=2ADA7QMBPC5FP) on the subject. There is certainly a vocal group in the industry that claims TDD is critically important to writing good software.

[David Heinemeier Hansson](http://david.heinemeierhansson.com/) (whose name is often abbreviated to DHH) is the creator of [Ruby on Rails](http://rubyonrails.org/) expressed what seems to be a fairly widely held opinion against TDD in his blog post [TDD is dead. Long live testing](http://david.heinemeierhansson.com/2014/tdd-is-dead-long-live-testing.html). An interesting aspect of that post is the point of view is taken that TDD has somehow won to become accepted as the right way to do development in the industry and is even causing harm. The post was written a few years ago now but the arguments don't appear to have changed too much.

In my personal experience, TDD is not generally accepted as a necessary process in software development and is rarely mandated. There is a lot of debate and while being a practitioner of TDD is not looked down upon, it is not generally seen as being important or necessarily correct. This differs between software teams of course but in general, this is my experience. It is very common at standups I have attended to hear developers say things like, 'I am done but just need to add tests now'. In conversations like this, I have never heard anyone suggest the TDD process should have been used. It is left to the individual developers to decide that for the most part.

[Bob Martin](https://en.wikipedia.org/wiki/Robert_Cecil_Martin) can be a polarizing individual but he is an important proponent of TDD. He attempts to refute DHH's points in his post [When TDD doesn’t work](https://8thlight.com/blog/uncle-bob/2014/04/30/When-tdd-does-not-work.html).

A reference within the original 'TDD is dead' post is the article [Why Most Unit Testing is Waste](http://rbcs-us.com/documents/Why-Most-Unit-Testing-is-Waste.pdf) by [Jim Coplien ](https://en.wikipedia.org/wiki/Jim_Coplien) which is discussed in the video where [Jim Coplien and Bob Martin Debate TDD](https://www.youtube.com/watch?v=KtHQGs3zFAM).

The TDD is dead subject also led to a long discussion between [Kent Beck](https://www.facebook.com/kentlbeck), [Martin Fowler](http://www.martinfowler.com/) and [David Heinemeier Hansson](http://david.heinemeierhansson.com/) which is quite entertaining and can be watched here if you are interested:

- [TW Hangouts | Is TDD dead? - YouTube](https://www.youtube.com/watch?v=z9quxZsLcfo)
- [TW Hangouts | Is TDD dead? Part II - YouTube](https://www.youtube.com/watch?v=JoTB2mcjU7w)
- [TW Hangouts | Is TDD dead? Part III - YouTube](https://www.youtube.com/watch?v=YNw4baDz6WA)
- [TW Hangouts | Is TDD dead? Part V & VI - YouTube](https://www.youtube.com/watch?v=gWD6REVeKW4)

One interesting detail in those videos was the discussion around a pleasurable workflow and if there is a notable distinction in this area between a mind that prefers to write a test to begin solving a problem or a mind that prefers not to write a test until some form of solution to the problem has already been written.

All this covers the input of only a few people in the industry and there are many more examples. I am pointing these out here because, despite the rich debate that took place in all these blog posts and discussions, no conclusive answers can be arrived at. It seems rare that one side convinces. That may just be the nature of things but maybe we can explore it a little deeper.

In nearly all the discussions there was a consensus that automated testing is important. Most disagreements seemed to be around the perception of TDD as a process and perhaps the granularity of automated tests too.

As with so many subjects in software development, a lot of the information about TDD that we share and consume is based on opinions and anecdotes. We hear about many stories from the perspective of the storyteller and we try to build up a picture of what is right so we can try to apply that to our own situations. We generally just try things to see if they work. Some data would be useful. Is it just that software development is very difficult to measure in this way? When it comes to TDD at least some efforts have been made to gather data.

## Studies on TDD

In 2003 a study called [An Initial Investigation of Test Driven Development in
Industry](http://staff.unak.is/andy/MScTestingMaintenance/Homeworks/STMHeima7TestDrivenDevelopment.pdf) was conducted with ’24 professional pair programmers’ where one group developed with TDD and another group used a more conventional (at the time) design-develop-test-debug waterfall approach. That study also references an earlier German Study that was run with 19 graduate students that concluded that

> test-first manner neither leads to quicker development nor provides
> an increase in quality. However, the understandability of the
> program increases, measured in terms of proper reuse of existing
> interfaces.

There were a lot of limitations to that study which the 2003 study were trying to address.

According to the George and Williams paper, the TDD group produced code that passed 18% more functional black box test cases but took 16% more time for development.

> A hypothesis of this research was that the TDD approach would yield code with superior external code quality. Based on the data analysis conducted, the experimental findings are supportive that the TDD approach yields code with superior external code quality. However, the validity of the results must be considered within the context of the limitations discussed in external validity section.

There were also some interesting findings on the lack of testing done by the control group. Not practising TDD appeared to cause a leaning towards a lack of testing in general.

This study had many limitations but it was still a good effort to gather some real data on how TDD might work in the industry. In terms of proof that TDD works or not, this study is far from that.

An interesting paper to look at is [Janzen, D. S., (2006). An Empirical Evaluation of the Impact of
Test-Driven Development on Software Quality](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.94.9412&rep=rep1&type=pdf) which looks at other studies and does analysis on data gathered by them. This is a long paper and I won't repeat much of it here but I will highlight some interesting data and points from it. The data is interesting but it is worth keeping in mind the data is from the early 2000's with relatively small sample sizes.

Below are tables with summaries of findings from various papers referenced in [Janzen, D. S., (2006)](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.94.9412&rep=rep1&type=pdf)

Type (CE) is a controlled experiment and (CS) is a case study.

#### In Industry

| Study                                                                                                | Type | No.of Companies | No. of Programmers | Quality Effects                 | Productivity Effects |
| ---------------------------------------------------------------------------------------------------- | ---- | --------------- | ------------------ | ------------------------------- | -------------------- |
| [George](https://pdfs.semanticscholar.org/616d/3f7e831c725b51220a34fbee3ca6ac1d711c.pdf)             | CE   | 3               | 24                 | TDD passed 18% more tests       | TDD took 16% longer  |
| [Maximilien](http://faculty.salisbury.edu/~xswang/Research/Papers/SERelated/TDD/p564-maximilien.pdf) | CS   | 1               | 9                  | 50% reduction in defect density | minimal impact       |
| [Williams](http://ieeexplore.ieee.org/document/1251029/)                                             | CS   | 1               | 9                  | 40% reduction in defect density | no change            |

#### In Academia

| Study                                                                                       | Type | No. of Programmers | Quality Effects             | Productivity Effects  |
| ------------------------------------------------------------------------------------------- | ---- | ------------------ | --------------------------- | --------------------- |
| [Edwards](http://www.cs.tufts.edu/~nr/cs257/archive/stephen-edwards/automated-feedback.pdf) | CE   | 59                 | 54% fewer defects           | n/a                   |
| [Kaufmann](http://dl.acm.org/citation.cfm?id=949421)                                        | CE   | 8                  | improved information flow   | 50% improvement       |
| [Muller](http://ieeexplore.ieee.org/document/1049202/)                                      | CE   | 19                 | no change, but better reuse | no change             |
| [Pancur](http://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=1248175)                   | CE   | 38                 | no change                   | no change             |
| [Erdogmus](http://ieeexplore.ieee.org/document/1423994/)                                    | CE   | 35                 | no change                   | improved productivity |

The data here suggest mostly positive or neutral results from TDD. There is one exception (the previously mentioned George paper) where TDD took 16% longer than the control group but it is noted the control group wrote fewer tests in that study.

> The essence of TDD as a design methodology is virtually unstudied, yet scattered early adoption has proceeded based solely on anecdotal evidence.

> While empirical studies will rarely produce absolute repeatable results, such studies can provide evidence of causal relationships, implying results that will most likely occur in given contexts.

This to me is a great point. Measurement is difficult and getting fully conclusive results for something like this is almost impossible but we can still use the evidence to help make decisions.

> Survey data reveals that developer opinions about the TDD process improve with TDD experience whereas opinions of test-last programming decrease.

Much of the data in that paper relies on surveys. These surveys indicated that the more knowledge and experience a developer had with testing and software development in general, the more likely the developer would be of having a better experience with TDD as a process. Interesting but not a major revelation of course.

A conclusion the paper arrived at:

> This research has demonstrated that TDD can and is likely to improve some software quality aspects at minimal cost over a comparable test-last approach. In particular it has shown statistically significant differences in the areas of code complexity, size, and testing.

This conclusion seems very positive in favour of TDD. A notable issue with these studies is that the sample size is quite small, putting some doubt on the statistical significance of the results. That said, I would argue this work is better than nothing and gives us something to go on at least.

> This research revealed a number of differences between TDD acceptance and efficacy in beginning and mature developers.

This is just an interesting observation to me. Why is there a correlation between experience and an acceptance of TDD?

A similar work: [Overview of the Test Driven Development
Research Projects and Experiments ](http://proceedings.informingscience.org/InSITE2012/InSITE12p165-187Bulajic0052.pdf) also looks at varied research papers. This one is slightly newer (2012) and included some more recent research. A significant addition is a study with IBM and Microsoft development teams.

Final conclusion in this study was (Nagappan et al., 2008):

- Reducing of defect density (IBM 40%, Microsoft 60% - 90%)
- Increase of time taken to code feature (15% - 35%).

Threats to the validity of the study were identified as (Nagappan et al., 2008):

- Higher motivation of developers that were using TDD methodology.
- The project developed by using TDD might be easier.

The findings of that paper were less positive than Janzen's as they rightly noted the results were too varied and the sample sizes too small to draw any positive conclusions.

Another [controlled experiment conducted in 2012](http://www.ipr.mdh.se/pdf_publications/2345.pdf) once again concluded that TDD is probably a good thing but that more evidence is needed.

[Another study from 2016](http://people.brunel.ac.uk/~csstmms/FucciEtAl_ESEM2016.pdf) looked at the effects of TDD compared to Test Last Development (TLD).

> In this paper we reported a replication of an experiment
> [13] in which TDD was compared to a test-last approach.

This study seemed to lean towards a verdict that TDD doesn't improve things over TLD:

> Given the limitations presented in Section 5, it appears that
> TDD does not improve, nor deteriorate the participants’
> performance with respect to an iterative development technique
> in which unit tests are written after production code

If you look at how the tests were conducted though you can see an interesting aspect of it is how programmers were to use iterative development. There was a fairly tight loop between test and production code for both TDD and TLD. Perhaps a tight iterative loop is more important than the order of test code?

In my opinion, this paper didn't provide enough data to give a conclusion one way or the other. It certainly didn't prove TDD was better or worse than writing all your tests after writing all your production code for a decent sized project.

The final study we will glance at is one I just recently came across called [A dissection of the test-driven development process: does it really matter to test-first or to test-last?](https://arxiv.org/pdf/1611.05994.pdf) which is also by Fucci et al. This study actually appears to reach a similar conclusion to the previous study except that in this case, the programmers involved work in industry. Also, the comparisons were with iterative test last (ITL) development (which I think is a better term than TLD for this) and TDD.

Another interesting conclusion in that study is that shorter cycle times (time between production code and test), to a point, do appear to lead to better quality.

## Some Conclusions

Looking at the data it is fairly easy to say the answer to the questions 'Does TDD Work?' is inconclusive.

If the question becomes more specific at least there are some answers.

The evidence appears to be heavily stacked in favour of short iterative test cycles, very similar to that prescribed in TDD literature, being significantly better for code quality with minimal impact on productivity. A process of small iterations with small testable blocks of code does appear to lead to more maintainable code.

Current evidence suggests that unit testing beats integration and higher level testing.

There is currently very little evidence that practising TDD is bad.

Whether writing a test first or last is better within a tight iterative cycle is inconclusive.

Testing is a discipline that takes time to be learned before seeing the real benefits of it. That is my own observation but is supported by observations in some of the studies we looked at.

Will we ever know for sure if TDD really works or not? I don't know. On a positive note, It does seem that questions like this are being asked more often these days. More rigorous study is being done. Take the book [Accelerate](https://itrevolution.com/book/accelerate/) by [Nicole Forsgren](http://nicolefv.com/), [Jez Humble](https://twitter.com/jezhumble) and [Gene Kim](https://itrevolution.com/faculty/gene-kim/) for example. It's not about TDD specifically but it's an amazing example of the work being done to try and figure out what techniques really work in software development so at least we should have more accurate information to help us make decisions about subjects like this.

## Personal Thoughts On All This

I spend a lot of time urging other developers to do TDD or at least to try it out. Usually, people will give it a go but have difficulty sticking with it. I try to explain that it is something you learn over time and when you get good at it, it’s great!

It occurred to me fairly often that I might be wrong. What if I am trying to get people to invest time in something that isn’t that great. What proof is there that TDD even works? Just because it seems to work for me, it does not automatically follow it will work for everybody.

That was the reason for this post. I wanted to look for proof that TDD actually works. I also wanted to read as much as I could from people who are against TDD or some aspect of it. Just because I think TDD is good I tended to avoid them and that’s not a good way to learn.

I personally do think varied approaches to TDD are OK. The definition of TDD shouldn't be like some ancient text to be taken absolutely literally and never altered.

To me, one of the biggest advantages (maybe the most under-appreciated advantage) of TDD is the design that it encourages. A complaint I always hear is that too many unit tests lead to code that's difficult to maintain and change. That's just a common pitfall in the learning process. Once you add TDD to your arsenal of software development techniques and learn it well, it should really help in achieving good software design. If good, clean, well-designed software is your goal, I believe TDD is something that will help really help you to achieve that.

It does sometimes feel like TDD is just a little too hard though. It reminds me of trying to do functional programming in Java. If everything is designed from the beginning to facilitate TDD, it's fairly easy. That is so rare still, and trying to do TDD all the time is really difficult in the systems we have to work with. Thanks to the tools and educational material out there today, things seem to be getting better though.

Despite the downsides, after everything I have read and experienced, I still consider TDD an excellent tool to have. I will keep using it and encouraging others to do the same.

## References

[George, B., Williams, L., (2003). An Initial Investigation of Test Driven Development in Industry](http://staff.unak.is/andy/MScTestingMaintenance/Homeworks/STMHeima7TestDrivenDevelopment.pdf)

[Janzen, D., Saiedian, S., (2005). Test-Driven Development: Concepts, Taxonomy, and Future Direction](http://digitalcommons.calpoly.edu/cgi/viewcontent.cgi?article=1034&context=csse_fac)

[Janzen, D. S., (2006). An Empirical Evaluation of the Impact of Test-Driven Development on Software Quality.](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.94.9412&rep=rep1&type=pdf)

[Sanchez, J. C., Williams, L., Maximilien, M, (2007). On the Sustained Use of a Test-Driven Development Practice at IBM](https://pdfs.semanticscholar.org/a00c/61b77e2df21b43d5e500341d5efec286c195.pdf)

[Bulajic, A., Sambasivam, S., Stojic, R., (2012). Overview of the Test Driven Development Research Projects and Experiments.](http://proceedings.informingscience.org/InSITE2012/InSITE12p165-187Bulajic0052.pdf)

[Causevic, A., Sundmark, D., Punnekkat, S, (2012). Impact of Test Design Technique Knowledge on Test Driven Development: A Controlled Experiment](http://www.ipr.mdh.se/pdf_publications/2345.pdf)

[Mäkinen, S., Münch, J., (2014). Effects of Test-Driven Development: A Comparative Analysis of Empirical Studies](https://tuhat.halvi.helsinki.fi/portal/files/29553974/2014_01_swqd_author_version.pdf)

[Fucci, D., Scanniello, G., Romano, S., Shepperd, M., Sigweni, B., Uyaguari, F., Turhan, B., Juristo, N., Oivo, M., (2016). An External Replication on the Effects of Test-driven Development Using a Multi-site Blind Analysis Approach](http://people.brunel.ac.uk/~csstmms/FucciEtAl_ESEM2016.pdf)

[Goto Fail, Heartbleed, and Unit Testing Culture](http://www.martinfowler.com/articles/testing-culture.html)

[Test-driven development - Wikipedia](https://en.wikipedia.org/wiki/Test-driven_development)

[A dissection of the test-driven development process: does it really matter to test-first or to test-last? Fucci et al., ICSE (2017)](https://arxiv.org/pdf/1611.05994.pdf)

[A dissection of the test-driven development process: does it really matter to test-first or test-last? | the morning paper](https://blog.acolyer.org/2017/06/13/a-dissection-of-the-test-driven-development-process-does-it-really-matter-to-test-first-or-test-last/)

[Bertrand Russell - Face to Face Interview (BBC, 1959) - YouTube](https://www.youtube.com/watch?v=1bZv3pSaLtY)

[Bertrand Russell - In Our Time BBC Radio 4 - YouTube](https://www.youtube.com/watch?v=z5JQjcSfUO0)

[Bertrand Russell (Part 1 of 6) Authority and the Individual: Social Cohesion and Human Nature - YouTube](https://www.youtube.com/watch?v=9EF4I7HM0zI)
