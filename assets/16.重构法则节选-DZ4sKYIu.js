import{A as e,d as t,p as n}from"./vendor~app~AiReviewLab~AstraReviewLab~SearchBox~index.html~index.html~index.html~404.html~R~ig3f05ik-ic5Uo-eM.js";import{di as r}from"./common-Cbt-vr6o.js";var i=JSON.parse(`{"path":"/article/0aafvv76/","title":"重构法则节选(下) | 博客","lang":"zh-CN","frontmatter":{"title":"重构法则节选(下)","author":"Mars Chin","createTime":"2017/10/05 16:32:55","permalink":"/article/0aafvv76/","cover":"/images/reactor/reactor.jpg","tag":["重构"],"copyright":{"license":"CC-BY-NC-4.0","author":{"name":"Mars Chin","url":"https://github.com/mars13333"}},"watermark":true},"readingTime":{"minutes":84.29,"words":25288},"git":{"createdTime":1734709501000},"filePathRelative":"blog/16.重构法则节选.md","headers":[]}`),a={name:`16.重构法则节选.md`};function o(r,i,a,o,s,c){return e(),t(`div`,null,[...i[0]||=[n(`<p>🤓看到shi山代码还头疼呢？重构了解一下？</p><h1 id="_10-简化条件逻辑" tabindex="-1"><a class="header-anchor" href="#_10-简化条件逻辑"><span>10.简化条件逻辑</span></a></h1><p>程序的大部分威力来自条件逻辑，但很不幸，程序的复杂度也大多来自条件逻辑。我经常借助重构把条件逻辑变得更容易理解。我常用分解条件表达式（260）处理复杂的条件表达式，用合并条件表达式（263）厘清逻辑组合。我会用以卫语句取代嵌套条件表达式（266）清晰表达“在主要处理逻辑之前先做检查”的意图。如果我发现一处 switch 逻辑处理了几种情况，可以考虑拿出以多态取代条件表达式（272）重构手法。</p><p>很多条件逻辑是用于处理特殊情况的，例如处理 null 值。如果对某种特殊情况的处理逻辑大多相同，那么可以用引入特例（289）（常被称作引入空对象）消除重复代码。另外，虽然我很喜欢去除条件逻辑，但如果我想明确地表述（以及检查）程序的状态，引入断言（302）是一个不错的补充。</p><h2 id="_10-1-分解条件表达式-decompose-conditional" tabindex="-1"><a class="header-anchor" href="#_10-1-分解条件表达式-decompose-conditional"><span>10.1 分解条件表达式（Decompose Conditional）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (!aDate.isBefore(plan.summerStart) &amp;amp;&amp;amp; !aDate.isAfter(plan.summerEnd))</span></span>
<span class="line"><span> charge = quantity * plan.summerRate;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> charge = quantity * plan.regularRate + plan.regularServiceCharge;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (summer())</span></span>
<span class="line"><span> charge = summerCharge();</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> charge = regularCharge();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机" tabindex="-1"><a class="header-anchor" href="#动机"><span>动机</span></a></h3><p>程序之中，复杂的条件逻辑是最常导致复杂度上升的地点之一。我必须编写代码来检查不同的条件分支，根据不同的条件做不同的事，然后，我很快就会得到一个相当长的函数。大型函数本身就会使代码的可读性下降，而条件逻辑则会使代码更难阅读。在带有复杂条件逻辑的函数中，代码（包括检查条件分支的代码和真正实现功能的代码）会告诉我发生的事，但常常让我弄不清楚为什么会发生这样的事，这就说明代码的可读性的确大大降低了。</p><p>和任何大块头代码一样，我可以将它分解为多个独立的函数，根据每个小块代码的用途，为分解而得的新函数命名，并将原函数中对应的代码改为调用新函数，从而更清楚地表达自己的意图。对于条件逻辑，将每个分支条件分解成新函数还可以带来更多好处：可以突出条件逻辑，更清楚地表明每个分支的作用，并且突出每个分支的原因。</p><p>本重构手法其实只是提炼函数（106）的一个应用场景。但我要特别强调这个场景，因为我发现它经常会带来很大的价值。</p><h3 id="做法" tabindex="-1"><a class="header-anchor" href="#做法"><span>做法</span></a></h3><p>对条件判断和每个条件分支分别运用提炼函数（106）手法。</p><h3 id="范例" tabindex="-1"><a class="header-anchor" href="#范例"><span>范例</span></a></h3><p>假设我要计算购买某样商品的总价（总价=数量 × 单价），而这个商品在冬季和夏季的单价是不同的：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (!aDate.isBefore(plan.summerStart) &amp;amp;&amp;amp; !aDate.isAfter(plan.summerEnd))</span></span>
<span class="line"><span> charge = quantity * plan.summerRate;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> charge = quantity * plan.regularRate + plan.regularServiceCharge;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我把条件判断提炼到一个独立的函数中：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (summer())</span></span>
<span class="line"><span> charge = quantity * plan.summerRate;</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> charge = quantity * plan.regularRate + plan.regularServiceCharge;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function summer() {</span></span>
<span class="line"><span> return !aDate.isBefore(plan.summerStart) &amp;amp;&amp;amp; !aDate.isAfter(plan.summerEnd);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后提炼条件判断为真的分支：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (summer())</span></span>
<span class="line"><span> charge = summerCharge();</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> charge = quantity * plan.regularRate + plan.regularServiceCharge;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function summer() {</span></span>
<span class="line"><span> return !aDate.isBefore(plan.summerStart) &amp;amp;&amp;amp; !aDate.isAfter(plan.summerEnd);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function summerCharge() {</span></span>
<span class="line"><span> return quantity * plan.summerRate;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后提炼条件判断为假的分支：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (summer())</span></span>
<span class="line"><span> charge = summerCharge();</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> charge = regularCharge();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function summer() {</span></span>
<span class="line"><span> return !aDate.isBefore(plan.summerStart) &amp;amp;&amp;amp; !aDate.isAfter(plan.summerEnd);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function summerCharge() {</span></span>
<span class="line"><span> return quantity * plan.summerRate;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function regularCharge() {</span></span>
<span class="line"><span> return quantity * plan.regularRate + plan.regularServiceCharge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提炼完成后，我喜欢用三元运算符重新安排条件语句。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>  charge = summer() ? summerCharge() : regularCharge();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function summer() {</span></span>
<span class="line"><span> return !aDate.isBefore(plan.summerStart) &amp;amp;&amp;amp; !aDate.isAfter(plan.summerEnd);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function summerCharge() {</span></span>
<span class="line"><span> return quantity * plan.summerRate;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function regularCharge() {</span></span>
<span class="line"><span> return quantity * plan.regularRate + plan.regularServiceCharge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-2-合并条件表达式-consolidate-conditional-expression" tabindex="-1"><a class="header-anchor" href="#_10-2-合并条件表达式-consolidate-conditional-expression"><span>10.2 合并条件表达式（Consolidate Conditional Expression）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (anEmployee.seniority &lt; 2) return 0;</span></span>
<span class="line"><span>if (anEmployee.monthsDisabled &gt; 12) return 0;</span></span>
<span class="line"><span>if (anEmployee.isPartTime) return 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (isNotEligibleForDisability()) return 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function isNotEligibleForDisability() {</span></span>
<span class="line"><span> return ((anEmployee.seniority &lt; 2)</span></span>
<span class="line"><span>     || (anEmployee.monthsDisabled &gt; 12)</span></span>
<span class="line"><span>     || (anEmployee.isPartTime));</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-1" tabindex="-1"><a class="header-anchor" href="#动机-1"><span>动机</span></a></h3><p>有时我会发现这样一串条件检查：检查条件各不相同，最终行为却一致。如果发现这种情况，就应该使用“逻辑或”和“逻辑与”将它们合并为一个条件表达式。</p><p>之所以要合并条件代码，有两个重要原因。首先，合并后的条件代码会表述“实际上只有一次条件检查，只不过有多个并列条件需要检查而已”，从而使这一次检查的用意更清晰。当然，合并前和合并后的代码有着相同的效果，但原先代码传达出的信息却是“这里有一些各自独立的条件测试，它们只是恰好同时发生”。其次，这项重构往往可以为使用提炼函数（106）做好准备。将检查条件提炼成一个独立的函数对于厘清代码意义非常有用，因为它把描述“做什么”的语句换成了“为什么这样做”。</p><p>条件语句的合并理由也同时指出了不要合并的理由：如果我认为这些检查的确彼此独立，的确不应该被视为同一次检查，我就不会使用本项重构。</p><h3 id="做法-1" tabindex="-1"><a class="header-anchor" href="#做法-1"><span>做法</span></a></h3><p>确定这些条件表达式都没有副作用。</p><p>如果某个条件表达式有副作用，可以先用将查询函数和修改函数分离（306）处理。</p><p>使用适当的逻辑运算符，将两个相关条件表达式合并为一个。</p><p>顺序执行的条件表达式用逻辑或来合并，嵌套的 if 语句用逻辑与来合并。</p><p>测试。</p><p>重复前面的合并过程，直到所有相关的条件表达式都合并到一起。</p><p>可以考虑对合并后的条件表达式实施提炼函数（106）。</p><h3 id="范例-1" tabindex="-1"><a class="header-anchor" href="#范例-1"><span>范例</span></a></h3><p>在走读代码的过程中，我看到了下面的代码片段：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function disabilityAmount(anEmployee) {</span></span>
<span class="line"><span> if (anEmployee.seniority &lt; 2) return 0;</span></span>
<span class="line"><span> if (anEmployee.monthsDisabled &gt; 12) return 0;</span></span>
<span class="line"><span> if (anEmployee.isPartTime) return 0;</span></span>
<span class="line"><span> // compute the disability amount</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里有一连串的条件检查，都指向同样的结果。既然结果是相同的，就应该把这些条件检查合并成一条表达式。对于这样顺序执行的条件检查，可以用逻辑或运算符来合并。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function disabilityAmount(anEmployee) {</span></span>
<span class="line"><span> if ((anEmployee.seniority &lt; 2)</span></span>
<span class="line"><span>   || (anEmployee.monthsDisabled &gt; 12)) return 0;</span></span>
<span class="line"><span> if (anEmployee.isPartTime) return 0;</span></span>
<span class="line"><span> // compute the disability amount</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试，然后把下一个条件检查也合并进来：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function disabilityAmount(anEmployee) {</span></span>
<span class="line"><span> if ((anEmployee.seniority &lt; 2)</span></span>
<span class="line"><span>   || (anEmployee.monthsDisabled &gt; 12)</span></span>
<span class="line"><span>   || (anEmployee.isPartTime)) return 0;</span></span>
<span class="line"><span> // compute the disability amount</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>合并完成后，再对这句条件表达式使用提炼函数（106）。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function disabilityAmount(anEmployee) {</span></span>
<span class="line"><span> if (isNotEligableForDisability()) return 0;</span></span>
<span class="line"><span> // compute the disability amount</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function isNotEligableForDisability() {</span></span>
<span class="line"><span> return ((anEmployee.seniority &lt; 2)</span></span>
<span class="line"><span>     || (anEmployee.monthsDisabled &gt; 12)</span></span>
<span class="line"><span>     || (anEmployee.isPartTime));</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="范例-使用逻辑与" tabindex="-1"><a class="header-anchor" href="#范例-使用逻辑与"><span>范例：使用逻辑与</span></a></h3><p>上面的例子展示了用逻辑或合并条件表达式的做法。不过，我有可能遇到需要逻辑与的情况。例如，嵌套 if 语句的情况：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (anEmployee.onVacation)</span></span>
<span class="line"><span> if (anEmployee.seniority &gt; 10)</span></span>
<span class="line"><span>  return 1;</span></span>
<span class="line"><span>return 0.5;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以用逻辑与运算符将其合并。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if ((anEmployee.onVacation)</span></span>
<span class="line"><span>  &amp;amp;&amp;amp; (anEmployee.seniority &gt; 10)) return 1;</span></span>
<span class="line"><span>return 0.5;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果原来的条件逻辑混杂了这两种情况，我也会根据需要组合使用逻辑与和逻辑或运算符。在这种时候，代码很可能变得混乱，所以我会频繁使用提炼函数（106），把代码变得可读。</p><h2 id="_10-3-以卫语句取代嵌套条件表达式-replace-nested-conditional-with-guard-clauses" tabindex="-1"><a class="header-anchor" href="#_10-3-以卫语句取代嵌套条件表达式-replace-nested-conditional-with-guard-clauses"><span>10.3 以卫语句取代嵌套条件表达式（Replace Nested Conditional with Guard Clauses）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function getPayAmount() {</span></span>
<span class="line"><span>  let result;</span></span>
<span class="line"><span>  if (isDead) result = deadAmount();</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    if (isSeparated) result = separatedAmount();</span></span>
<span class="line"><span>    else {</span></span>
<span class="line"><span>      if (isRetired) result = retiredAmount();</span></span>
<span class="line"><span>      else result = normalPayAmount();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function getPayAmount() {</span></span>
<span class="line"><span>  if (isDead) return deadAmount();</span></span>
<span class="line"><span>  if (isSeparated) return separatedAmount();</span></span>
<span class="line"><span>  if (isRetired) return retiredAmount();</span></span>
<span class="line"><span>  return normalPayAmount();</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-2" tabindex="-1"><a class="header-anchor" href="#动机-2"><span>动机</span></a></h3><p>根据我的经验，条件表达式通常有两种风格。第一种风格是：两个条件分支都属于正常行为。第二种风格则是：只有一个条件分支是正常行为，另一个分支则是异常的情况。</p><p>这两类条件表达式有不同的用途，这一点应该通过代码表现出来。如果两条分支都是正常行为，就应该使用形如 if...else...的条件表达式；如果某个条件极其罕见，就应该单独检查该条件，并在该条件为真时立刻从函数中返回。这样的单独检查常常被称为“卫语句”（guard clauses）。</p><p>以卫语句取代嵌套条件表达式的精髓就是：给某一条分支以特别的重视。如果使用 if-then-else 结构，你对 if 分支和 else 分支的重视是同等的。这样的代码结构传递给阅读者的消息就是：各个分支有同样的重要性。卫语句就不同了，它告诉阅读者：“这种情况不是本函数的核心逻辑所关心的，如果它真发生了，请做一些必要的整理工作，然后退出。”</p><p>“每个函数只能有一个入口和一个出口”的观念，根深蒂固于某些程序员的脑海里。我发现，当我处理他们编写的代码时，经常需要使用以卫语句取代嵌套条件表达式。现今的编程语言都会强制保证每个函数只有一个入口，至于“单一出口”规则，其实不是那么有用。在我看来，保持代码清晰才是最关键的：如果单一出口能使这个函数更清楚易读，那么就使用单一出口；否则就不必这么做。</p><h3 id="做法-2" tabindex="-1"><a class="header-anchor" href="#做法-2"><span>做法</span></a></h3><p>选中最外层需要被替换的条件逻辑，将其替换为卫语句。</p><p>测试。</p><p>有需要的话，重复上述步骤。</p><p>如果所有卫语句都引发同样的结果，可以使用合并条件表达式（263）合并之。</p><h3 id="范例-2" tabindex="-1"><a class="header-anchor" href="#范例-2"><span>范例</span></a></h3><p>下面的代码用于计算要支付给员工（employee）的工资。只有还在公司上班的员工才需要支付工资，所以这个函数需要检查两种“员工已经不在公司上班”的情况。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function payAmount(employee) {</span></span>
<span class="line"><span> let result;</span></span>
<span class="line"><span> if(employee.isSeparated) {</span></span>
<span class="line"><span>  result = {amount: 0, reasonCode:&quot;SEP&quot;};</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else {</span></span>
<span class="line"><span>  if (employee.isRetired) {</span></span>
<span class="line"><span>   result = {amount: 0, reasonCode: &quot;RET&quot;};</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>   // logic to compute amount</span></span>
<span class="line"><span>   lorem.ipsum(dolor.sitAmet);1</span></span>
<span class="line"><span>   consectetur(adipiscing).elit();</span></span>
<span class="line"><span>   sed.do.eiusmod = tempor.incididunt.ut(labore) &amp;amp;&amp;amp; dolore(magna.aliqua);</span></span>
<span class="line"><span>   ut.enim.ad(minim.veniam);</span></span>
<span class="line"><span>   result = someFinalComputation();</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>嵌套的条件逻辑让我们看不清代码真实的含义。只有当前两个条件表达式都不为真的时候，这段代码才真正开始它的主要工作。所以，卫语句能让代码更清晰地阐述自己的意图。</p><p>一如既往地，我喜欢小步前进，所以我先处理最顶上的条件逻辑。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function payAmount(employee) {</span></span>
<span class="line"><span> let result;</span></span>
<span class="line"><span> if (employee.isSeparated) return {amount: 0, reasonCode: &quot;SEP&quot;};</span></span>
<span class="line"><span> if (employee.isRetired) {</span></span>
<span class="line"><span>  result = {amount: 0, reasonCode: &quot;RET&quot;};</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else {</span></span>
<span class="line"><span>  // logic to compute amount</span></span>
<span class="line"><span>  lorem.ipsum(dolor.sitAmet);</span></span>
<span class="line"><span>  consectetur(adipiscing).elit();</span></span>
<span class="line"><span>  sed.do.eiusmod = tempor.incididunt.ut(labore) &amp;amp;&amp;amp; dolore(magna.aliqua);</span></span>
<span class="line"><span>  ut.enim.ad(minim.veniam);</span></span>
<span class="line"><span>  result = someFinalComputation();</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>做完这步修改，我执行测试，然后继续下一步。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function payAmount(employee) {</span></span>
<span class="line"><span> let result;</span></span>
<span class="line"><span> if (employee.isSeparated) return {amount: 0, reasonCode: &quot;SEP&quot;};</span></span>
<span class="line"><span> if (employee.isRetired)   return {amount: 0, reasonCode: &quot;RET&quot;};</span></span>
<span class="line"><span> // logic to compute amount</span></span>
<span class="line"><span> lorem.ipsum(dolor.sitAmet);</span></span>
<span class="line"><span> consectetur(adipiscing).elit();</span></span>
<span class="line"><span> sed.do.eiusmod = tempor.incididunt.ut(labore) &amp;amp;&amp;amp; dolore(magna.aliqua);</span></span>
<span class="line"><span> ut.enim.ad(minim.veniam);</span></span>
<span class="line"><span> result = someFinalComputation();</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时，result 变量已经没有用处了，所以我把它删掉：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function payAmount(employee) {</span></span>
<span class="line"><span> let result;</span></span>
<span class="line"><span> if (employee.isSeparated) return {amount: 0, reasonCode: &quot;SEP&quot;};</span></span>
<span class="line"><span> if (employee.isRetired)   return {amount: 0, reasonCode: &quot;RET&quot;};</span></span>
<span class="line"><span> // logic to compute amount</span></span>
<span class="line"><span> lorem.ipsum(dolor.sitAmet);</span></span>
<span class="line"><span> consectetur(adipiscing).elit();</span></span>
<span class="line"><span> sed.do.eiusmod = tempor.incididunt.ut(labore) &amp;amp;&amp;amp; dolore(magna.aliqua);</span></span>
<span class="line"><span> ut.enim.ad(minim.veniam);</span></span>
<span class="line"><span> return someFinalComputation();</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>能减少一个可变变量总是好的。</p><h3 id="范例-将条件反转" tabindex="-1"><a class="header-anchor" href="#范例-将条件反转"><span>范例：将条件反转</span></a></h3><p>审阅本书第 1 版的初稿时，Joshua Kerievsky 指出：我们常常可以将条件表达式反转，从而实现以卫语句取代嵌套条件表达式。为了拯救我可怜的想象力，他还好心帮我想了一个例子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function adjustedCapital(anInstrument) {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> if (anInstrument.capital &gt; 0) {</span></span>
<span class="line"><span>  if (anInstrument.interestRate &gt; 0 &amp;amp;&amp;amp; anInstrument.duration &gt; 0) {</span></span>
<span class="line"><span>   result = (anInstrument.income / anInstrument.duration) * anInstrument.adjustmentFactor;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样地，我逐一进行替换。不过这次在插入卫语句时，我需要将相应的条件反转过来：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function adjustedCapital(anInstrument) {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> if (anInstrument.capital &lt;= 0) return result;</span></span>
<span class="line"><span> if (anInstrument.interestRate &gt; 0 &amp;amp;&amp;amp; anInstrument.duration &gt; 0) {</span></span>
<span class="line"><span>  result = (anInstrument.income / anInstrument.duration) * anInstrument.adjustmentFactor;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下一个条件稍微复杂一点，所以我分两步进行反转。首先加入一个逻辑非操作：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function adjustedCapital(anInstrument) {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> if (anInstrument.capital &lt;= 0) return result;</span></span>
<span class="line"><span> if (!(anInstrument.interestRate &gt; 0 &amp;amp;&amp;amp; anInstrument.duration &gt; 0)) return result;</span></span>
<span class="line"><span> result = (anInstrument.income / anInstrument.duration) * anInstrument.adjustmentFactor;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是在这样的条件表达式中留下一个逻辑非，会把我的脑袋拧成一团乱麻，所以我把它简化成下面这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>  function adjustedCapital(anInstrument) {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> if (anInstrument.capital &lt;= 0) return result;</span></span>
<span class="line"><span> if (anInstrument.interestRate &lt;= 0 || anInstrument.duration &lt;= 0) return result;</span></span>
<span class="line"><span> result = (anInstrument.income / anInstrument.duration) * anInstrument.adjustmentFactor;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这两行逻辑语句引发的结果一样，所以我可以用合并条件表达式（263）将其合并。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function adjustedCapital(anInstrument) {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> if (   anInstrument.capital      &lt;= 0</span></span>
<span class="line"><span>   || anInstrument.interestRate &lt;= 0</span></span>
<span class="line"><span>   || anInstrument.duration     &lt;= 0) return result;</span></span>
<span class="line"><span> result = (anInstrument.income / anInstrument.duration) * anInstrument.adjustmentFactor;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时 result 变量做了两件事：一开始我把它设为 0，代表卫语句被触发时的返回值；然后又用最终计算的结果给它赋值。我可以彻底移除这个变量，避免用一个变量承担两重责任，而且又减少了一个可变变量。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function adjustedCapital(anInstrument) {</span></span>
<span class="line"><span> if (   anInstrument.capital     &lt;= 0</span></span>
<span class="line"><span>   || anInstrument.interestRate &lt;= 0</span></span>
<span class="line"><span>   || anInstrument.duration   &lt;= 0) return 0;</span></span>
<span class="line"><span> return (anInstrument.income / anInstrument.duration) * anInstrument.adjustmentFactor;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1 “lorem.ipsum……”是一篇常见于排版设计领域的文章，其内容为不具可读性的字符组合，目的是使阅读者只专注于观察段落的字型和版型。——译者注</p><h2 id="_10-4-以多态取代条件表达式-replace-conditional-with-polymorphism" tabindex="-1"><a class="header-anchor" href="#_10-4-以多态取代条件表达式-replace-conditional-with-polymorphism"><span>10.4 以多态取代条件表达式（Replace Conditional with Polymorphism）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>switch (bird.type) {</span></span>
<span class="line"><span> case &#39;EuropeanSwallow&#39;:</span></span>
<span class="line"><span>  return &quot;average&quot;;</span></span>
<span class="line"><span> case &#39;AfricanSwallow&#39;:</span></span>
<span class="line"><span>  return (bird.numberOfCoconuts &gt; 2) ? &quot;tired&quot; : &quot;average&quot;;</span></span>
<span class="line"><span> case &#39;NorwegianBlueParrot&#39;:</span></span>
<span class="line"><span>  return (bird.voltage &gt; 100) ? &quot;scorched&quot; : &quot;beautiful&quot;;</span></span>
<span class="line"><span> default:</span></span>
<span class="line"><span>  return &quot;unknown&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class EuropeanSwallow {</span></span>
<span class="line"><span> get plumage() {</span></span>
<span class="line"><span>  return &quot;average&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>class AfricanSwallow {</span></span>
<span class="line"><span> get plumage() {</span></span>
<span class="line"><span>   return (this.numberOfCoconuts &gt; 2) ? &quot;tired&quot; : &quot;average&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>class NorwegianBlueParrot {</span></span>
<span class="line"><span> get plumage() {</span></span>
<span class="line"><span>   return (this.voltage &gt; 100) ? &quot;scorched&quot; : &quot;beautiful&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-3" tabindex="-1"><a class="header-anchor" href="#动机-3"><span>动机</span></a></h3><p>复杂的条件逻辑是编程中最难理解的东西之一，因此我一直在寻求给条件逻辑添加结构。很多时候，我发现可以将条件逻辑拆分到不同的场景（或者叫高阶用例），从而拆解复杂的条件逻辑。这种拆分有时用条件逻辑本身的结构就足以表达，但使用类和多态能把逻辑的拆分表述得更清晰。</p><p>一个常见的场景是：我可以构造一组类型，每个类型处理各自的一种条件逻辑。例如，我会注意到，图书、音乐、食品的处理方式不同，这是因为它们分属不同类型的商品。最明显的征兆就是有好几个函数都有基于类型代码的 switch 语句。若果真如此，我就可以针对 switch 语句中的每种分支逻辑创建一个类，用多态来承载各个类型特有的行为，从而去除重复的分支逻辑。</p><p>另一种情况是：有一个基础逻辑，在其上又有一些变体。基础逻辑可能是最常用的，也可能是最简单的。我可以把基础逻辑放进超类，这样我可以首先理解这部分逻辑，暂时不管各种变体，然后我可以把每种变体逻辑单独放进一个子类，其中的代码着重强调与基础逻辑的差异。</p><p>多态是面向对象编程的关键特性之一。跟其他一切有用的特性一样，它也很容易被滥用。我曾经遇到有人争论说所有条件逻辑都应该用多态取代。我不赞同这种观点。我的大部分条件逻辑只用到了基本的条件语句——if/else 和 switch/case，并不需要劳师动众地引入多态。但如果发现如前所述的复杂条件逻辑，多态是改善这种情况的有力工具。</p><h3 id="做法-3" tabindex="-1"><a class="header-anchor" href="#做法-3"><span>做法</span></a></h3><p>如果现有的类尚不具备多态行为，就用工厂函数创建之，令工厂函数返回恰当的对象实例。</p><p>在调用方代码中使用工厂函数获得对象实例。</p><p>将带有条件逻辑的函数移到超类中。</p><p>如果条件逻辑还未提炼至独立的函数，首先对其使用提炼函数（106）。</p><p>任选一个子类，在其中建立一个函数，使之覆写超类中容纳条件表达式的那个函数。将与该子类相关的条件表达式分支复制到新函数中，并对它进行适当调整。</p><p>重复上述过程，处理其他条件分支。</p><p>在超类函数中保留默认情况的逻辑。或者，如果超类应该是抽象的，就把该函数声明为 abstract，或在其中直接抛出异常，表明计算责任都在子类中。</p><h3 id="范例-3" tabindex="-1"><a class="header-anchor" href="#范例-3"><span>范例</span></a></h3><p>我的朋友有一群鸟儿，他想知道这些鸟飞得有多快，以及它们的羽毛是什么样的。所以我们写了一小段程序来判断这些信息。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function plumages(birds) {</span></span>
<span class="line"><span> return new Map(birds.map(b =&gt; [b.name, plumage(b)]));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function speeds(birds) {</span></span>
<span class="line"><span> return new Map(birds.map(b =&gt; [b.name, airSpeedVelocity(b)]));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function plumage(bird) {</span></span>
<span class="line"><span> switch (bird.type) {</span></span>
<span class="line"><span> case &#39;EuropeanSwallow&#39;:</span></span>
<span class="line"><span>  return &quot;average&quot;;</span></span>
<span class="line"><span> case &#39;AfricanSwallow&#39;:</span></span>
<span class="line"><span>  return (bird.numberOfCoconuts &gt; 2) ? &quot;tired&quot; : &quot;average&quot;;</span></span>
<span class="line"><span> case &#39;NorwegianBlueParrot&#39;:</span></span>
<span class="line"><span>  return (bird.voltage &gt; 100) ? &quot;scorched&quot; : &quot;beautiful&quot;;</span></span>
<span class="line"><span> default:</span></span>
<span class="line"><span>  return &quot;unknown&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function airSpeedVelocity(bird) {</span></span>
<span class="line"><span> switch (bird.type) {</span></span>
<span class="line"><span> case &#39;EuropeanSwallow&#39;:</span></span>
<span class="line"><span>  return 35;</span></span>
<span class="line"><span> case &#39;AfricanSwallow&#39;:</span></span>
<span class="line"><span>  return 40 - 2 * bird.numberOfCoconuts;</span></span>
<span class="line"><span> case &#39;NorwegianBlueParrot&#39;:</span></span>
<span class="line"><span>  return (bird.isNailed) ? 0 : 10 + bird.voltage / 10;</span></span>
<span class="line"><span> default:</span></span>
<span class="line"><span>  return null;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有两个不同的操作，其行为都随着“鸟的类型”发生变化，因此可以创建出对应的类，用多态来处理各类型特有的行为。</p><p>我先对 airSpeedVelocity 和 plumage 两个函数使用函数组合成类（144）。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function plumage(bird) {</span></span>
<span class="line"><span> return new Bird(bird).plumage;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function airSpeedVelocity(bird) {</span></span>
<span class="line"><span> return new Bird(bird).airSpeedVelocity;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class Bird {</span></span>
<span class="line"><span> constructor(birdObject) {</span></span>
<span class="line"><span>  Object.assign(this, birdObject);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get plumage() {</span></span>
<span class="line"><span>  switch (this.type) {</span></span>
<span class="line"><span>  case &#39;EuropeanSwallow&#39;:</span></span>
<span class="line"><span>   return &quot;average&quot;;</span></span>
<span class="line"><span>  case &#39;AfricanSwallow&#39;:</span></span>
<span class="line"><span>   return (this.numberOfCoconuts &gt; 2) ? &quot;tired&quot; : &quot;average&quot;;</span></span>
<span class="line"><span>  case &#39;NorwegianBlueParrot&#39;:</span></span>
<span class="line"><span>   return (this.voltage &gt; 100) ? &quot;scorched&quot; : &quot;beautiful&quot;;</span></span>
<span class="line"><span>  default:</span></span>
<span class="line"><span>   return &quot;unknown&quot;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get airSpeedVelocity() {</span></span>
<span class="line"><span>  switch (this.type) {</span></span>
<span class="line"><span>  case &#39;EuropeanSwallow&#39;:</span></span>
<span class="line"><span>   return 35;</span></span>
<span class="line"><span>  case &#39;AfricanSwallow&#39;:</span></span>
<span class="line"><span>   return 40 - 2 * this.numberOfCoconuts;</span></span>
<span class="line"><span>  case &#39;NorwegianBlueParrot&#39;:</span></span>
<span class="line"><span>   return (this.isNailed) ? 0 : 10 + this.voltage / 10;</span></span>
<span class="line"><span>  default:</span></span>
<span class="line"><span>   return null;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后针对每种鸟创建一个子类，用一个工厂函数来实例化合适的子类对象。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function plumage(bird) {</span></span>
<span class="line"><span>  return createBird(bird).plumage;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function airSpeedVelocity(bird) {</span></span>
<span class="line"><span>  return createBird(bird).airSpeedVelocity;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function createBird(bird) {</span></span>
<span class="line"><span>  switch (bird.type) {</span></span>
<span class="line"><span>    case &quot;EuropeanSwallow&quot;:</span></span>
<span class="line"><span>      return new EuropeanSwallow(bird);</span></span>
<span class="line"><span>    case &quot;AfricanSwallow&quot;:</span></span>
<span class="line"><span>      return new AfricanSwallow(bird);</span></span>
<span class="line"><span>    case &quot;NorweigianBlueParrot&quot;:</span></span>
<span class="line"><span>      return new NorwegianBlueParrot(bird);</span></span>
<span class="line"><span>    default:</span></span>
<span class="line"><span>      return new Bird(bird);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class EuropeanSwallow extends Bird {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class AfricanSwallow extends Bird {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class NorwegianBlueParrot extends Bird {}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我已经有了需要的类结构，可以处理两个条件逻辑了。先从 plumage 函数开始，我从 switch 语句中选一个分支，在适当的子类中覆写这个逻辑。</p><p><strong>class EuropeanSwallow...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get plumage() {</span></span>
<span class="line"><span>  return &quot;average&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class Bird...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get plumage() {</span></span>
<span class="line"><span> switch (this.type) {</span></span>
<span class="line"><span> case &#39;EuropeanSwallow&#39;:</span></span>
<span class="line"><span>  throw &quot;oops&quot;;</span></span>
<span class="line"><span> case &#39;AfricanSwallow&#39;:</span></span>
<span class="line"><span>  return (this.numberOfCoconuts &gt; 2) ? &quot;tired&quot; : &quot;average&quot;;</span></span>
<span class="line"><span> case &#39;NorwegianBlueParrot&#39;:</span></span>
<span class="line"><span>  return (this.voltage &gt; 100) ? &quot;scorched&quot; : &quot;beautiful&quot;;</span></span>
<span class="line"><span> default:</span></span>
<span class="line"><span>  return &quot;unknown&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在超类中，我把对应的逻辑分支改为抛出异常，因为我总是偏执地担心出错。</p><p>此时我就可以编译并测试。如果一切顺利的话，我可以接着处理下一个分支。</p><p><strong>class AfricanSwallow...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get plumage() {</span></span>
<span class="line"><span>   return (this.numberOfCoconuts &gt; 2) ? &quot;tired&quot; : &quot;average&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是挪威蓝鹦鹉（Norwegian Blue）的分支。</p><p><strong>class NorwegianBlueParrot...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get plumage() {</span></span>
<span class="line"><span>   return (this.voltage &gt;100) ? &quot;scorched&quot; : &quot;beautiful&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>超类函数保留下来处理默认情况。</p><p><strong>class Bird...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get plumage() {</span></span>
<span class="line"><span>  return &quot;unknown&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>airSpeedVelocity 也如法炮制。完成以后，代码大致如下（我还对顶层的 airSpeedVelocity 和 plumage 函数做了内联处理）：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function plumages(birds) {</span></span>
<span class="line"><span> return new Map(birds</span></span>
<span class="line"><span>         .map(b =&gt; createBird(b))</span></span>
<span class="line"><span>         .map(bird =&gt; [bird.name, bird.plumage]));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function speeds(birds) {</span></span>
<span class="line"><span> return new Map(birds</span></span>
<span class="line"><span>         .map(b =&gt; createBird(b))</span></span>
<span class="line"><span>         .map(bird =&gt; [bird.name, bird.airSpeedVelocity]));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function createBird(bird) {</span></span>
<span class="line"><span> switch (bird.type) {</span></span>
<span class="line"><span> case &#39;EuropeanSwallow&#39;:</span></span>
<span class="line"><span>  return new EuropeanSwallow(bird);</span></span>
<span class="line"><span> case &#39;AfricanSwallow&#39;:</span></span>
<span class="line"><span>  return new AfricanSwallow(bird);</span></span>
<span class="line"><span> case &#39;NorwegianBlueParrot&#39;:</span></span>
<span class="line"><span>  return new NorwegianBlueParrot(bird);</span></span>
<span class="line"><span> default:</span></span>
<span class="line"><span>  return new Bird(bird);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Bird {</span></span>
<span class="line"><span> constructor(birdObject) {</span></span>
<span class="line"><span>  Object.assign(this, birdObject);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get plumage() {</span></span>
<span class="line"><span>  return &quot;unknown&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get airSpeedVelocity() {</span></span>
<span class="line"><span>  return null;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class EuropeanSwallow extends Bird {</span></span>
<span class="line"><span> get plumage() {</span></span>
<span class="line"><span>  return &quot;average&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get airSpeedVelocity() {</span></span>
<span class="line"><span>  return 35;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class AfricanSwallow extends Bird {</span></span>
<span class="line"><span> get plumage() {</span></span>
<span class="line"><span>  return (this.numberOfCoconuts &gt; 2) ? &quot;tired&quot; : &quot;average&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get airSpeedVelocity() {</span></span>
<span class="line"><span>  return 40 - 2 * this.numberOfCoconuts;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>class NorwegianBlueParrot extends Bird {</span></span>
<span class="line"><span> get plumage() {</span></span>
<span class="line"><span>  return (this.voltage &gt; 100) ? &quot;scorched&quot; : &quot;beautiful&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get airSpeedVelocity() {</span></span>
<span class="line"><span>  return (this.isNailed) ? 0 : 10 + this.voltage / 10;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看着最终的代码，可以看出 Bird 超类并不是必需的。在 JavaScript 中，多态不一定需要类型层级，只要对象实现了适当的函数就行。但在这个例子中，我愿意保留这个不必要的超类，因为它能帮助阐释各个子类与问题域之间的关系。</p><h3 id="范例-用多态处理变体逻辑" tabindex="-1"><a class="header-anchor" href="#范例-用多态处理变体逻辑"><span>范例：用多态处理变体逻辑</span></a></h3><p>在前面的例子中，“鸟”的类型体系是一个清晰的泛化体系：超类是抽象的“鸟”，子类是各种具体的鸟。这是教科书（包括我写的书）中经常讨论的继承和多态，但并不是实践中使用继承的唯一方式。实际上，这种方式很可能不是最常用或最好的方式。另一种使用继承的情况是：我想表达某个对象与另一个对象大体类似，但又有一些不同之处。</p><p>下面有一个这样的例子：有一家评级机构，要对远洋航船的航行进行投资评级。这家评级机构会给出“A”或者“B”两种评级，取决于多种风险和盈利潜力的因素。在评估风险时，既要考虑航程本身的特征，也要考虑船长过往航行的历史。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function rating(voyage, history) {</span></span>
<span class="line"><span> const vpf = voyageProfitFactor(voyage, history);</span></span>
<span class="line"><span> const vr = voyageRisk(voyage);</span></span>
<span class="line"><span> const chr = captainHistoryRisk(voyage, history);</span></span>
<span class="line"><span> if (vpf * 3 &gt; (vr + chr * 2)) return &quot;A&quot;;</span></span>
<span class="line"><span> else return &quot;B&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function voyageRisk(voyage) {</span></span>
<span class="line"><span> let result = 1;</span></span>
<span class="line"><span> if (voyage.length &gt; 4) result += 2;</span></span>
<span class="line"><span> if (voyage.length &gt; 8) result += voyage.length - 8;</span></span>
<span class="line"><span> if ([&quot;china&quot;, &quot;east-indies&quot;].includes(voyage.zone)) result += 4;</span></span>
<span class="line"><span> return Math.max(result, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function captainHistoryRisk(voyage, history) {</span></span>
<span class="line"><span> let result = 1;</span></span>
<span class="line"><span> if (history.length &lt; 5) result += 4;</span></span>
<span class="line"><span> result += history.filter(v =&gt; v.profit &lt; 0).length;</span></span>
<span class="line"><span> if (voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; hasChina(history)) result -= 2;</span></span>
<span class="line"><span> return Math.max(result, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function hasChina(history) {</span></span>
<span class="line"><span> return history.some(v =&gt; &quot;china&quot; === v.zone);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function voyageProfitFactor(voyage, history) {</span></span>
<span class="line"><span> let result = 2;</span></span>
<span class="line"><span> if (voyage.zone === &quot;china&quot;) result += 1;</span></span>
<span class="line"><span> if (voyage.zone === &quot;east-indies&quot;) result += 1;</span></span>
<span class="line"><span> if (voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; hasChina(history)) {</span></span>
<span class="line"><span>  result += 3;</span></span>
<span class="line"><span>  if (history.length &gt; 10) result += 1;</span></span>
<span class="line"><span>  if (voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span>  if (voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else {</span></span>
<span class="line"><span>  if (history.length &gt; 8) result += 1;</span></span>
<span class="line"><span>  if (voyage.length &gt; 14) result -= 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>voyageRisk 和 captainHistoryRisk 两个函数负责打出风险分数，voyageProfitFactor 负责打出盈利潜力分数，rating 函数将 3 个分数组合到一起，给出一次航行的综合评级。</p><p>调用方的代码大概是这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const voyage = { zone: &quot;west-indies&quot;, length: 10 };</span></span>
<span class="line"><span>const history = [</span></span>
<span class="line"><span>  { zone: &quot;east-indies&quot;, profit: 5 },</span></span>
<span class="line"><span>  { zone: &quot;west-indies&quot;, profit: 15 },</span></span>
<span class="line"><span>  { zone: &quot;china&quot;, profit: -2 },</span></span>
<span class="line"><span>  { zone: &quot;west-africa&quot;, profit: 7 },</span></span>
<span class="line"><span>];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const myRating = rating(voyage, history);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码中有两处同样的条件逻辑，都在询问“是否有到中国的航程”以及“船长是否曾去过中国”。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function rating(voyage, history) {</span></span>
<span class="line"><span> const vpf = voyageProfitFactor(voyage, history);</span></span>
<span class="line"><span> const vr = voyageRisk(voyage);</span></span>
<span class="line"><span> const chr = captainHistoryRisk(voyage, history);</span></span>
<span class="line"><span> if (vpf * 3 &gt; (vr + chr * 2)) return &quot;A&quot;;</span></span>
<span class="line"><span> else return &quot;B&quot;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function voyageRisk(voyage) {</span></span>
<span class="line"><span> let result = 1;</span></span>
<span class="line"><span> if (voyage.length &gt; 4) result += 2;</span></span>
<span class="line"><span> if (voyage.length &gt; 8) result += voyage.length - 8;</span></span>
<span class="line"><span> if ([&quot;china&quot;, &quot;east-indies&quot;].includes(voyage.zone)) result += 4;</span></span>
<span class="line"><span> return Math.max(result, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function captainHistoryRisk(voyage, history) {</span></span>
<span class="line"><span> let result = 1;</span></span>
<span class="line"><span> if (history.length &lt; 5) result += 4;</span></span>
<span class="line"><span> result += history.filter(v =&gt; v.profit &lt; 0).length;</span></span>
<span class="line"><span> if (voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; hasChina(history)) result -= 2;</span></span>
<span class="line"><span> return Math.max(result, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function hasChina(history) {</span></span>
<span class="line"><span> return history.some(v =&gt; &quot;china&quot; === v.zone);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function voyageProfitFactor(voyage, history) {</span></span>
<span class="line"><span> let result = 2;</span></span>
<span class="line"><span> if (voyage.zone === &quot;china&quot;) result += 1;</span></span>
<span class="line"><span> if (voyage.zone === &quot;east-indies&quot;) result += 1;</span></span>
<span class="line"><span> if (voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; hasChina(history)) {</span></span>
<span class="line"><span>  result += 3;</span></span>
<span class="line"><span>  if (history.length &gt; 10) result += 1;</span></span>
<span class="line"><span>  if (voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span>  if (voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else {</span></span>
<span class="line"><span>  if (history.length &gt; 8) result += 1;</span></span>
<span class="line"><span>  if (voyage.length &gt; 14) result -= 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我会用继承和多态将处理“中国因素”的逻辑从基础逻辑中分离出来。如果还要引入更多的特殊逻辑，这个重构就很有用——这些重复的“中国因素”会混淆视听，让基础逻辑难以理解。</p><p>起初代码里只有一堆函数，如果要引入多态的话，我需要先建立一个类结构，因此我首先使用函数组合成类（144）。这一步重构的结果如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function rating(voyage, history) {</span></span>
<span class="line"><span> return new Rating(voyage, history).value;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Rating {</span></span>
<span class="line"><span> constructor(voyage, history) {</span></span>
<span class="line"><span>  this.voyage = voyage;</span></span>
<span class="line"><span>  this.history = history;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get value() {</span></span>
<span class="line"><span>  const vpf = this.voyageProfitFactor;</span></span>
<span class="line"><span>  const vr = this.voyageRisk;</span></span>
<span class="line"><span>  const chr = this.captainHistoryRisk;</span></span>
<span class="line"><span>  if (vpf * 3 &gt; (vr + chr * 2)) return &quot;A&quot;;</span></span>
<span class="line"><span>  else return &quot;B&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get voyageRisk() {</span></span>
<span class="line"><span>  let result = 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 4) result += 2;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 8) result += this.voyage.length - 8;</span></span>
<span class="line"><span>  if ([&quot;china&quot;, &quot;east-indies&quot;].includes(this.voyage.zone)) result += 4;</span></span>
<span class="line"><span>  return Math.max(result, 0);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get captainHistoryRisk() {</span></span>
<span class="line"><span>  let result = 1;</span></span>
<span class="line"><span>  if (this.history.length &lt; 5) result += 4;</span></span>
<span class="line"><span>  result += this.history.filter(v =&gt; v.profit &lt; 0).length;</span></span>
<span class="line"><span>  if (this.voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; this.hasChinaHistory) result -= 2;</span></span>
<span class="line"><span>  return Math.max(result, 0);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get voyageProfitFactor() {</span></span>
<span class="line"><span>  let result = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (this.voyage.zone === &quot;china&quot;) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.zone === &quot;east-indies&quot;) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; this.hasChinaHistory) {</span></span>
<span class="line"><span>   result += 3;</span></span>
<span class="line"><span>   if (this.history.length &gt; 10) result += 1;</span></span>
<span class="line"><span>   if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span>   if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>   if (this.history.length &gt; 8) result += 1;</span></span>
<span class="line"><span>   if (this.voyage.length &gt; 14) result -= 1;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get hasChinaHistory() {</span></span>
<span class="line"><span>  return this.history.some(v =&gt; &quot;china&quot; === v.zone);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>于是我就有了一个类，用来安放基础逻辑。现在我需要另建一个空的子类，用来安放与超类不同的行为。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>class ExperiencedChinaRating extends Rating {}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后，建立一个工厂函数，用于在需要时返回变体类。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function createRating(voyage, history) {</span></span>
<span class="line"><span> if (voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; history.some(v =&gt; &quot;china&quot; === v.zone))</span></span>
<span class="line"><span>  return new ExperiencedChinaRating(voyage, history);</span></span>
<span class="line"><span> else return new Rating(voyage, history);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我需要修改所有调用方代码，让它们使用该工厂函数，而不要直接调用构造函数。还好现在调用构造函数的只有 rating 函数一处。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function rating(voyage, history) {</span></span>
<span class="line"><span>  return createRating(voyage, history).value;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有两处行为需要移入子类中。我先处理 captainHistoryRisk 中的逻辑。</p><p><strong>class Rating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get captainHistoryRisk() {</span></span>
<span class="line"><span> let result = 1;</span></span>
<span class="line"><span> if (this.history.length &lt; 5) result += 4;</span></span>
<span class="line"><span> result += this.history.filter(v =&gt; v.profit &lt; 0).length;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; this.hasChinaHistory) result -= 2;</span></span>
<span class="line"><span> return Math.max(result, 0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在子类中覆写这个函数。</p><p>class ExperiencedChinaRating</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get captainHistoryRisk() {</span></span>
<span class="line"><span>  const result = super.captainHistoryRisk - 2;</span></span>
<span class="line"><span>  return Math.max(result, 0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class Rating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get captainHistoryRisk() {</span></span>
<span class="line"><span> let result = 1;</span></span>
<span class="line"><span> if (this.history.length &lt; 5) result += 4;</span></span>
<span class="line"><span> result += this.history.filter(v =&gt; v.profit &lt; 0).length;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; this.hasChinaHistory) result -= 2;</span></span>
<span class="line"><span> return Math.max(result, 0);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>分离 voyageProfitFactor 函数中的变体行为要更麻烦一些。我不能直接从超类中删掉变体行为，因为在超类中还有另一条执行路径。我又不想把整个超类中的函数复制到子类中。</p><p><strong>class Rating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageProfitFactor() {</span></span>
<span class="line"><span> let result = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if (this.voyage.zone === &quot;china&quot;) result += 1;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;east-indies&quot;) result += 1;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; this.hasChinaHistory) {</span></span>
<span class="line"><span>  result += 3;</span></span>
<span class="line"><span>  if (this.history.length &gt; 10) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else {</span></span>
<span class="line"><span>  if (this.history.length &gt; 8) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 14) result -= 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以我先用提炼函数（106）将整个条件逻辑块提炼出来。</p><p><strong>class Rating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageProfitFactor() {</span></span>
<span class="line"><span> let result = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if (this.voyage.zone === &quot;china&quot;) result += 1;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;east-indies&quot;) result += 1;</span></span>
<span class="line"><span> result += this.voyageAndHistoryLengthFactor;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>get voyageAndHistoryLengthFactor() {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;china&quot; &amp;amp;&amp;amp; this.hasChinaHistory) {</span></span>
<span class="line"><span>  result += 3;</span></span>
<span class="line"><span>  if (this.history.length &gt; 10) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else {</span></span>
<span class="line"><span>  if (this.history.length &gt; 8) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 14) result -= 1;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数名中出现“And”字样是一个很不好的味道，不过我会暂时容忍它，先聚焦子类化操作。</p><p><strong>class Rating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageAndHistoryLengthFactor() {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> if (this.history.length &gt; 8) result += 1;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 14) result -= 1;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class ExperiencedChinaRating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageAndHistoryLengthFactor() {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> result += 3;</span></span>
<span class="line"><span> if (this.history.length &gt; 10) result += 1;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>严格说来，重构到这儿就结束了——我已经把变体行为分离到了子类中，超类的逻辑理解和维护起来更简单了，只有在进入子类代码时我才需要操心变体逻辑。子类的代码表述了它与超类的差异。</p><p>但我觉得至少应该谈谈如何处理这个丑陋的新函数。引入一个函数以便子类覆写，这在处理这种“基础和变体”的继承关系时是常见操作。但这样一个难看的函数只会妨碍——而不是帮助——别人理解其中的逻辑。</p><p>函数名中的“And”字样说明其中包含了两件事，所以我觉得应该将它们分开。我会用提炼函数（106）把“历史航行数”（history length）的相关逻辑提炼出来。这一步提炼在超类和子类中都要发生，我首先从超类开始。</p><p><strong>class Rating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageAndHistoryLengthFactor() {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> result += this.historyLengthFactor;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 14) result -= 1;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>get historyLengthFactor() {</span></span>
<span class="line"><span> return (this.history.length &gt; 8) ? 1 : 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在子类中也如法炮制。</p><p><strong>class ExperiencedChinaRating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageAndHistoryLengthFactor() {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> result += 3;</span></span>
<span class="line"><span> result += this.historyLengthFactor;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>get historyLengthFactor() {</span></span>
<span class="line"><span> return (this.history.length &gt; 10) ? 1 : 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在超类中使用搬移语句到调用者（217）。</p><p><strong>class Rating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageProfitFactor() {</span></span>
<span class="line"><span> let result = 2;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;china&quot;) result += 1;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;east-indies&quot;) result += 1;</span></span>
<span class="line"><span> result += this.historyLengthFactor;</span></span>
<span class="line"><span> result += this.voyageAndHistoryLengthFactor;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>get voyageAndHistoryLengthFactor() {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> result += this.historyLengthFactor;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 14) result -= 1;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class ExperiencedChinaRating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageAndHistoryLengthFactor() {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> result += 3;</span></span>
<span class="line"><span> result += this.historyLengthFactor;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再用函数改名（124）改掉这个难听的名字。</p><p><strong>class Rating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageProfitFactor() {</span></span>
<span class="line"><span> let result = 2;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;china&quot;) result += 1;</span></span>
<span class="line"><span> if (this.voyage.zone === &quot;east-indies&quot;) result += 1;</span></span>
<span class="line"><span> result += this.historyLengthFactor;</span></span>
<span class="line"><span> result += this.voyageLengthFactor;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>get voyageLengthFactor() {</span></span>
<span class="line"><span> return (this.voyage.length &gt; 14) ? - 1: 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>改为三元表达式，以简化 voyageLengthFactor 函数。</p><p><strong>class ExperiencedChinaRating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageLengthFactor() {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> result += 3;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span> if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后一件事：在“航程数”（voyage length）因素上加上 3 分，我认为这个逻辑不合理，应该把这 3 分加在最终的结果上。</p><p><strong>class ExperiencedChinaRating...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get voyageProfitFactor() {</span></span>
<span class="line"><span>  return super.voyageProfitFactor + 3;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>get voyageLengthFactor() {</span></span>
<span class="line"><span>  let result = 0;</span></span>
<span class="line"><span>  result += 3;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重构结束，我得到了如下代码。首先，我有一个基本的 Rating 类，其中不考虑与“中国经验”相关的复杂性：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>class Rating {</span></span>
<span class="line"><span> constructor(voyage, history) {</span></span>
<span class="line"><span>  this.voyage = voyage;</span></span>
<span class="line"><span>  this.history = history;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get value() {</span></span>
<span class="line"><span>  const vpf = this.voyageProfitFactor;</span></span>
<span class="line"><span>  const vr = this.voyageRisk;</span></span>
<span class="line"><span>  const chr = this.captainHistoryRisk;</span></span>
<span class="line"><span>  if (vpf * 3 &gt; (vr + chr * 2)) return &quot;A&quot;;</span></span>
<span class="line"><span>  else return &quot;B&quot;;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get voyageRisk() {</span></span>
<span class="line"><span>  let result = 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 4) result += 2;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 8) result += this.voyage.length - 8;</span></span>
<span class="line"><span>  if ([&quot;china&quot;, &quot;east-indies&quot;].includes(this.voyage.zone)) result += 4;</span></span>
<span class="line"><span>  return Math.max(result, 0);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get captainHistoryRisk() {</span></span>
<span class="line"><span>  let result = 1;</span></span>
<span class="line"><span>  if (this.history.length &lt; 5) result += 4;</span></span>
<span class="line"><span>  result += this.history.filter(v =&gt; v.profit &lt; 0).length;</span></span>
<span class="line"><span>  return Math.max(result, 0);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get voyageProfitFactor() {</span></span>
<span class="line"><span>  let result = 2;</span></span>
<span class="line"><span>  if (this.voyage.zone === &quot;china&quot;) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.zone === &quot;east-indies&quot;) result += 1;</span></span>
<span class="line"><span>  result += this.historyLengthFactor;</span></span>
<span class="line"><span>  result += this.voyageLengthFactor;</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get voyageLengthFactor() {</span></span>
<span class="line"><span>  return (this.voyage.length &gt; 14) ? - 1: 0;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get historyLengthFactor() {</span></span>
<span class="line"><span>  return (this.history.length &gt; 8) ? 1 : 0;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与“中国经验”相关的代码则清晰表述出在基本逻辑之上的一系列变体逻辑：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>class ExperiencedChinaRating extends Rating {</span></span>
<span class="line"><span> get captainHistoryRisk() {</span></span>
<span class="line"><span>  const result = super.captainHistoryRisk - 2;</span></span>
<span class="line"><span>  return Math.max(result, 0);</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get voyageLengthFactor() {</span></span>
<span class="line"><span>  let result = 0;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 12) result += 1;</span></span>
<span class="line"><span>  if (this.voyage.length &gt; 18) result -= 1;</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get historyLengthFactor() {</span></span>
<span class="line"><span>  return (this.history.length &gt; 10) ? 1 : 0;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> get voyageProfitFactor() {</span></span>
<span class="line"><span>  return super.voyageProfitFactor + 3;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-5-引入特例-introduce-special-case" tabindex="-1"><a class="header-anchor" href="#_10-5-引入特例-introduce-special-case"><span>10.5 引入特例（Introduce Special Case）</span></a></h2><p>曾用名：引入 Null 对象（Introduce Null Object）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (aCustomer === &quot;unknown&quot;) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class UnknownCustomer {</span></span>
<span class="line"><span>  get name() {return &quot;occupant&quot;;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-4" tabindex="-1"><a class="header-anchor" href="#动机-4"><span>动机</span></a></h3><p>一种常见的重复代码是这种情况：一个数据结构的使用者都在检查某个特殊的值，并且当这个特殊值出现时所做的处理也都相同。如果我发现代码库中有多处以同样方式应对同一个特殊值，我就会想要把这个处理逻辑收拢到一处。</p><p>处理这种情况的一个好办法是使用“特例”（Special Case）模式：创建一个特例元素，用以表达对这种特例的共用行为的处理。这样我就可以用一个函数调用取代大部分特例检查逻辑。</p><p>特例有几种表现形式。如果我只需要从这个对象读取数据，可以提供一个字面量对象（literal object），其中所有的值都是预先填充好的。如果除简单的数值之外还需要更多的行为，就需要创建一个特殊对象，其中包含所有共用行为所对应的函数。特例对象可以由一个封装类来返回，也可以通过变换插入一个数据结构。</p><p>一个通常需要特例处理的值就是 null，这也是这个模式常被叫作“Null 对象”（Null Object）模式的原因——我喜欢说：Null 对象是特例的一种特例。</p><h3 id="做法-4" tabindex="-1"><a class="header-anchor" href="#做法-4"><span>做法</span></a></h3><p>我们从一个作为容器的数据结构（或者类）开始，其中包含一个属性，该属性就是我们要重构的目标。容器的客户端每次使用这个属性时，都需要将其与某个特例值做比对。我们希望把这个特例值替换为代表这种特例情况的类或数据结构。</p><p>给重构目标添加检查特例的属性，令其返回 false。</p><p>创建一个特例对象，其中只有检查特例的属性，返回 true。</p><p>对“与特例值做比对”的代码运用提炼函数（106），确保所有客户端都使用这个新函数，而不再直接做特例值的比对。</p><p>将新的特例对象引入代码中，可以从函数调用中返回，也可以在变换函数中生成。</p><p>修改特例比对函数的主体，在其中直接使用检查特例的属性。</p><p>测试。</p><p>使用函数组合成类（144）或函数组合成变换（149），把通用的特例处理逻辑都搬移到新建的特例对象中。</p><p>特例类对于简单的请求通常会返回固定的值，因此可以将其实现为字面记录（literal record）。</p><p>对特例比对函数使用内联函数（115），将其内联到仍然需要的地方。</p><h3 id="范例-4" tabindex="-1"><a class="header-anchor" href="#范例-4"><span>范例</span></a></h3><p>一家提供公共事业服务的公司将自己的服务安装在各个场所（site）。</p><p><strong>class Site...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get customer() {return this._customer;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>代表“顾客”的 Customer 类有多个属性，我只考虑其中 3 个。</p><p><strong>class Customer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get name()           {...}</span></span>
<span class="line"><span>get billingPlan()    {...}</span></span>
<span class="line"><span>set billingPlan(arg) {...}</span></span>
<span class="line"><span>get paymentHistory() {...}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大多数情况下，一个场所会对应一个顾客，但有些场所没有与之对应的顾客，可能是因为之前的住户搬走了，而新搬来的住户我还不知道是谁。这种情况下，数据记录中的 customer 字段会被填充为字符串&quot;unknown&quot;。因为这种情况时有发生，所以 Site 对象的客户端必须有办法处理“顾客未知”的情况。下面是一些示例代码片段。</p><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const aCustomer = site.customer;</span></span>
<span class="line"><span>// ... lots of intervening code ...</span></span>
<span class="line"><span>let customerName;</span></span>
<span class="line"><span>if (aCustomer === &quot;unknown&quot;) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span>else customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan =</span></span>
<span class="line"><span>  aCustomer === &quot;unknown&quot; ? registry.billingPlans.basic : aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (aCustomer !== &quot;unknown&quot;) aCustomer.billingPlan = newPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>客户端 4...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent =</span></span>
<span class="line"><span>  aCustomer === &quot;unknown&quot;</span></span>
<span class="line"><span>    ? 0</span></span>
<span class="line"><span>    : aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>浏览整个代码库，我看到有很多使用 Site 对象的客户端在处理“顾客未知”的情况，大多数都用了同样的应对方式：用&quot;occupant&quot;（居民）作为顾客名，使用基本的计价套餐，并认为这家顾客没有欠费。到处都在检查这种特例，再加上对特例的处理方式高度一致，这些现象告诉我：是时候使用特例对象（Special Case Object）模式了。</p><p>我首先给 Customer 添加一个函数，用于指示“这个顾客是否未知”。</p><p><strong>class Customer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get isUnknown() {return false;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后我给“未知的顾客”专门创建一个类。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>class UnknownCustomer {</span></span>
<span class="line"><span>  get isUnknown() {</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意，我没有把 UnknownCustomer 类声明为 Customer 的子类。在其他编程语言（尤其是静态类型的编程语言）中，我会需要继承关系。但 JavaScript 是一种动态类型语言，按照它的子类化规则，这里不声明继承关系反而更好。</p><p>下面就是麻烦之处了。我必须在所有期望得到&quot;unknown&quot;值的地方返回这个新的特例对象，并修改所有检查&quot;unknown&quot;值的地方，令其使用新的 isUnknown 函数。一般而言，我总是希望细心安排修改过程，使我可以每次做一点小修改，然后马上测试。但如果我修改了 Customer 类，使其返回 UnknownCustomer 对象（而非&quot;unknown&quot;字符串），那么就必须同时修改所有客户端，让它们不要检查&quot;unknown&quot;字符串，而是调用 isUnknown 函数——这两个修改必须一次完成。我感觉这一大步修改就像一大块难吃的食物一样难以下咽。</p><p>还好，遇到这种困境时，有一个常用的技巧可以帮忙。如果有一段代码需要在很多地方做修改（例如我们这里的“与特例做比对”的代码），我会先对其使用提炼函数（106）。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function isUnknown(arg) {</span></span>
<span class="line"><span>  if (!(arg instanceof Customer || arg === &quot;unknown&quot;))</span></span>
<span class="line"><span>    throw new Error(\`investigate bad value: &lt;\${arg}&gt;\`);</span></span>
<span class="line"><span>  return arg === &quot;unknown&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我会放一个陷阱，捕捉意料之外的值。如果在重构过程中我犯了错误，引入了奇怪的行为，这个陷阱会帮我发现。</p><p>现在，凡是检查未知顾客的地方，都可以改用这个函数了。我可以逐一修改这些地方，每次修改之后都可以执行测试。</p><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>let customerName;</span></span>
<span class="line"><span>if (isUnknown(aCustomer)) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span>else customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>没用多久，就全部修改完了。</p><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan = isUnknown(aCustomer)</span></span>
<span class="line"><span>  ? registry.billingPlans.basic</span></span>
<span class="line"><span>  : aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (!isUnknown(aCustomer)) aCustomer.billingPlan = newPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>客户端 4...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent = isUnknown(aCustomer)</span></span>
<span class="line"><span>  ? 0</span></span>
<span class="line"><span>  : aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将所有调用处都改为使用 isUnknown 函数之后，就可以修改 Site 类，令其在顾客未知时返回 UnknownCustomer 对象。</p><p><strong>class Site...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get customer() {</span></span>
<span class="line"><span>  return (this._customer === &quot;unknown&quot;) ? new UnknownCustomer() : this._customer;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后修改 isUnknown 函数的判断逻辑。做完这步修改之后我可以做一次全文搜索，应该没有任何地方使用&quot;unknown&quot;字符串了。</p><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function isUnknown(arg) {</span></span>
<span class="line"><span>  if (!(arg instanceof Customer || arg instanceof UnknownCustomer))</span></span>
<span class="line"><span>    throw new Error(\`investigate bad value: &lt;\${arg}&gt;\`);</span></span>
<span class="line"><span>  return arg.isUnknown;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试，以确保一切运转如常。</p><p>现在，有趣的部分开始了。我可以逐一查看客户端检查特例的代码，看它们处理特例的逻辑，并考虑是否能用函数组合成类（144）将其替换为一个共同的、符合预期的值。此刻，有多处客户端代码用字符串&quot;occupant&quot;来作为未知顾客的名字，就像下面这样。</p><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>let customerName;</span></span>
<span class="line"><span>if (isUnknown(aCustomer)) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span>else customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我可以在 UnknownCustomer 类中添加一个合适的函数。</p><p><strong>class UnknownCustomer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get name() {return &quot;occupant&quot;;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>然后我就可以去掉所有条件代码。</p><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>测试通过之后，我可能会用内联变量（123）把 customerName 变量也消除掉。</p><p>接下来处理代表“计价套餐”的 billingPlan 属性。</p><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan = isUnknown(aCustomer)</span></span>
<span class="line"><span>  ? registry.billingPlans.basic</span></span>
<span class="line"><span>  : aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (!isUnknown(aCustomer)) aCustomer.billingPlan = newPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>对于读取该属性的行为，我的处理方法跟前面处理 name 属性一样——找到通用的应对方式，并在 UnknownCustomer 中使用之。至于对该属性的写操作，当前的代码没有对未知顾客调用过设值函数，所以在特例对象中，我会保留设值函数，但其中什么都不做。</p><p><strong>class UnknownCustomer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get billingPlan()  {return registry.billingPlans.basic;}</span></span>
<span class="line"><span>set billingPlan(arg) { /* ignore */ }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>读取的例子...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan = aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>更新的例子...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>aCustomer.billingPlan = newPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>特例对象是值对象，因此应该始终是不可变的，即便它们替代的原对象本身是可变的。</p><p>最后一个例子则更麻烦一些，因为特例对象需要返回另一个对象，后者又有其自己的属性。</p><p><strong>客户端...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent = isUnknown(aCustomer)</span></span>
<span class="line"><span>  ? 0</span></span>
<span class="line"><span>  : aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一般的原则是：如果特例对象需要返回关联对象，被返回的通常也是特例对象。所以，我需要创建一个代表“空支付记录”的特例类 NullPaymentHistory。</p><p><strong>class UnknownCustomer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get paymentHistory() {return new NullPaymentHistory();}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>class NullPaymentHistory...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get weeksDelinquentInLastYear() {return 0;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>客户端...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent = aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>我继续查看客户端代码，寻找是否有能用多态行为取代的地方。但也会有例外情况——客户端不想使用特例对象提供的逻辑，而是想做一些别的处理。我可能有 23 处客户端代码用&quot;occupant&quot;作为未知顾客的名字，但还有一处用了别的值。</p><p><strong>客户端...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const name = !isUnknown(aCustomer) ? aCustomer.name : &quot;unknown occupant&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>这种情况下，我只能在客户端保留特例检查的逻辑。我会对其做些修改，让它使用 aCustomer 对象身上的 isUnknown 函数，也就是对全局的 isUnknown 函数使用内联函数（115）。</p><p><strong>客户端...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const name = aCustomer.isUnknown ? &quot;unknown occupant&quot; : aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>处理完所有客户端代码后，全局的 isUnknown 函数应该没人再调用了，可以用移除死代码（237）将其移除。</p><h3 id="范例-使用对象字面量" tabindex="-1"><a class="header-anchor" href="#范例-使用对象字面量"><span>范例：使用对象字面量</span></a></h3><p>我们在上面处理的其实是一些很简单的值，却要创建一个这样的类，未免有点儿大动干戈。但在上面这个例子中，我必须创建这样一个类，因为 Customer 类是允许使用者更新其内容的。但如果面对一个只读的数据结构，我就可以改用字面量对象（literal object）。</p><p>还是前面这个例子——几乎完全一样，除了一件事：这次没有客户端对 Customer 对象做更新操作：</p><p><strong>class Site...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get customer() {return this._customer;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>class Customer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get name()           {...}</span></span>
<span class="line"><span>get billingPlan()    {...}</span></span>
<span class="line"><span>set billingPlan(arg) {...}</span></span>
<span class="line"><span>get paymentHistory() {...}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const aCustomer = site.customer;</span></span>
<span class="line"><span>// ... lots of intervening code ...</span></span>
<span class="line"><span>let customerName;</span></span>
<span class="line"><span>if (aCustomer === &quot;unknown&quot;) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span>else customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan =</span></span>
<span class="line"><span>  aCustomer === &quot;unknown&quot; ? registry.billingPlans.basic : aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent =</span></span>
<span class="line"><span>  aCustomer === &quot;unknown&quot;</span></span>
<span class="line"><span>    ? 0</span></span>
<span class="line"><span>    : aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和前面的例子一样，我首先在 Customer 中添加 isUnknown 属性，并创建一个包含同名字段的特例对象。这次的区别在于，特例对象是一个字面量。</p><p><strong>class Customer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get isUnknown() {return false;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>顶层作用域...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function createUnknownCustomer() {</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    isUnknown: true,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后我对检查特例的条件逻辑运用提炼函数（106）。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function isUnknown(arg) {</span></span>
<span class="line"><span>  return arg === &quot;unknown&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>let customerName;</span></span>
<span class="line"><span>if (isUnknown(aCustomer)) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span>else customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan = isUnknown(aCustomer)</span></span>
<span class="line"><span>  ? registry.billingPlans.basic</span></span>
<span class="line"><span>  : aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent = isUnknown(aCustomer)</span></span>
<span class="line"><span>  ? 0</span></span>
<span class="line"><span>  : aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>修改 Site 类和做条件判断的 isUnknown 函数，开始使用特例对象。</p><p><strong>class Site...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get customer() {</span></span>
<span class="line"><span>  return (this._customer === &quot;unknown&quot;) ? createUnknownCustomer() : this._customer;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>顶层作用域...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function isUnknown(arg) {</span></span>
<span class="line"><span>  return arg.isUnknown;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后把“以标准方式应对特例”的地方都替换成使用特例字面量的值。首先从“名字”开始：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function createUnknownCustomer() {</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    isUnknown: true,</span></span>
<span class="line"><span>    name: &quot;occupant&quot;,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>接着是“计价套餐”：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function createUnknownCustomer() {</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    isUnknown: true,</span></span>
<span class="line"><span>    name: &quot;occupant&quot;,</span></span>
<span class="line"><span>    billingPlan: registry.billingPlans.basic,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan = aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>同样，我可以在字面量对象中创建一个嵌套的空支付记录对象：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function createUnknownCustomer() {</span></span>
<span class="line"><span>  return {</span></span>
<span class="line"><span>    isUnknown: true,</span></span>
<span class="line"><span>    name: &quot;occupant&quot;,</span></span>
<span class="line"><span>    billingPlan: registry.billingPlans.basic,</span></span>
<span class="line"><span>    paymentHistory: {</span></span>
<span class="line"><span>      weeksDelinquentInLastYear: 0,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent = aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>如果使用了这样的字面量，应该使用诸如 Object.freeze 的方法将其冻结，使其不可变。通常，我还是喜欢用类多一点。</p><h3 id="范例-使用变换" tabindex="-1"><a class="header-anchor" href="#范例-使用变换"><span>范例：使用变换</span></a></h3><p>前面两个例子都涉及了一个类，其实本重构手法也同样适用于记录，只要增加一个变换步骤即可。</p><p>假设我们的输入是一个简单的记录结构，大概像这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>{</span></span>
<span class="line"><span> name: &quot;Acme Boston&quot;,</span></span>
<span class="line"><span> location: &quot;Malden MA&quot;,</span></span>
<span class="line"><span> // more site details</span></span>
<span class="line"><span> customer: {</span></span>
<span class="line"><span>  name: &quot;Acme Industries&quot;,</span></span>
<span class="line"><span>  billingPlan: &quot;plan-451&quot;,</span></span>
<span class="line"><span>  paymentHistory: {</span></span>
<span class="line"><span>   weeksDelinquentInLastYear: 7</span></span>
<span class="line"><span>   //more</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  // more</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有时顾客的名字未知，此时标记的方式与前面一样：将 customer 字段标记为字符串&quot;unknown&quot;。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>{</span></span>
<span class="line"><span>name: &quot;Warehouse Unit 15&quot;,</span></span>
<span class="line"><span>location: &quot;Malden MA&quot;,</span></span>
<span class="line"><span>// more site details</span></span>
<span class="line"><span>customer: &quot;unknown&quot;,</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端代码也类似，会检查“未知顾客”的情况：</p><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const site = acquireSiteData();</span></span>
<span class="line"><span>const aCustomer = site.customer;</span></span>
<span class="line"><span>// ... lots of intervening code ...</span></span>
<span class="line"><span>let customerName;</span></span>
<span class="line"><span>if (aCustomer === &quot;unknown&quot;) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span>else customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan =</span></span>
<span class="line"><span>  aCustomer === &quot;unknown&quot; ? registry.billingPlans.basic : aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent =</span></span>
<span class="line"><span>  aCustomer === &quot;unknown&quot;</span></span>
<span class="line"><span>    ? 0</span></span>
<span class="line"><span>    : aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我首先要让 Site 数据结构经过一次变换，目前变换中只做了深复制，没有对数据做任何处理。</p><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const rawSite = acquireSiteData();</span></span>
<span class="line"><span>const site = enrichSite(rawSite);</span></span>
<span class="line"><span>const aCustomer = site.customer;</span></span>
<span class="line"><span>// ... lots of intervening code ...</span></span>
<span class="line"><span>let customerName;</span></span>
<span class="line"><span>if (aCustomer === &quot;unknown&quot;) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span>else customerName = aCustomer.name;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function enrichSite(inputSite) {</span></span>
<span class="line"><span>  return _.cloneDeep(inputSite);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后对“检查未知顾客”的代码运用提炼函数（106）。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function isUnknown(aCustomer) {</span></span>
<span class="line"><span>  return aCustomer === &quot;unknown&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const rawSite = acquireSiteData();</span></span>
<span class="line"><span>const site = enrichSite(rawSite);</span></span>
<span class="line"><span>const aCustomer = site.customer;</span></span>
<span class="line"><span>// ... lots of intervening code ...</span></span>
<span class="line"><span>let customerName;</span></span>
<span class="line"><span>if (isUnknown(aCustomer)) customerName = &quot;occupant&quot;;</span></span>
<span class="line"><span>else customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan = isUnknown(aCustomer)</span></span>
<span class="line"><span>  ? registry.billingPlans.basic</span></span>
<span class="line"><span>  : aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent = isUnknown(aCustomer)</span></span>
<span class="line"><span>  ? 0</span></span>
<span class="line"><span>  : aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后开始对 Site 数据做增强，首先是给 customer 字段加上 isUnknown 属性。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function enrichSite(aSite) {</span></span>
<span class="line"><span>  const result = _.cloneDeep(aSite);</span></span>
<span class="line"><span>  const unknownCustomer = {</span></span>
<span class="line"><span>    isUnknown: true,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (isUnknown(result.customer)) result.customer = unknownCustomer;</span></span>
<span class="line"><span>  else result.customer.isUnknown = false;</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>随后修改检查特例的条件逻辑，开始使用新的属性。原来的检查逻辑也保留不动，所以现在的检查逻辑应该既能应对原来的 Site 数据，也能应对增强后的 Site 数据。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function isUnknown(aCustomer) {</span></span>
<span class="line"><span>  if (aCustomer === &quot;unknown&quot;) return true;</span></span>
<span class="line"><span>  else return aCustomer.isUnknown;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试，确保一切正常，然后针对特例使用函数组合成变换（149）。首先把“未知顾客的名字”的处理逻辑搬进增强函数。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function enrichSite(aSite) {</span></span>
<span class="line"><span>  const result = _.cloneDeep(aSite);</span></span>
<span class="line"><span>  const unknownCustomer = {</span></span>
<span class="line"><span>    isUnknown: true,</span></span>
<span class="line"><span>    name: &quot;occupant&quot;,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (isUnknown(result.customer)) result.customer = unknownCustomer;</span></span>
<span class="line"><span>  else result.customer.isUnknown = false;</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 1...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const rawSite = acquireSiteData();</span></span>
<span class="line"><span>const site = enrichSite(rawSite);</span></span>
<span class="line"><span>const aCustomer = site.customer;</span></span>
<span class="line"><span>// ... lots of intervening code ...</span></span>
<span class="line"><span>const customerName = aCustomer.name;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试，然后是“未知顾客的计价套餐”的处理逻辑。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function enrichSite(aSite) {</span></span>
<span class="line"><span>  const result = _.cloneDeep(aSite);</span></span>
<span class="line"><span>  const unknownCustomer = {</span></span>
<span class="line"><span>    isUnknown: true,</span></span>
<span class="line"><span>    name: &quot;occupant&quot;,</span></span>
<span class="line"><span>    billingPlan: registry.billingPlans.basic,</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (isUnknown(result.customer)) result.customer = unknownCustomer;</span></span>
<span class="line"><span>  else result.customer.isUnknown = false;</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 2...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const plan = aCustomer.billingPlan;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>再次测试，然后处理最后一处客户端代码。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function enrichSite(aSite) {</span></span>
<span class="line"><span>  const result = _.cloneDeep(aSite);</span></span>
<span class="line"><span>  const unknownCustomer = {</span></span>
<span class="line"><span>    isUnknown: true,</span></span>
<span class="line"><span>    name: &quot;occupant&quot;,</span></span>
<span class="line"><span>    billingPlan: registry.billingPlans.basic,</span></span>
<span class="line"><span>    paymentHistory: {</span></span>
<span class="line"><span>      weeksDelinquentInLastYear: 0,</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (isUnknown(result.customer)) result.customer = unknownCustomer;</span></span>
<span class="line"><span>  else result.customer.isUnknown = false;</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>客户端 3...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const weeksDelinquent = aCustomer.paymentHistory.weeksDelinquentInLastYear;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="_10-6-引入断言-introduce-assertion" tabindex="-1"><a class="header-anchor" href="#_10-6-引入断言-introduce-assertion"><span>10.6 引入断言（Introduce Assertion）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>  if (this.discountRate)</span></span>
<span class="line"><span>  base = base - (this.discountRate * base);</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  assert(this.discountRate&gt;= 0);</span></span>
<span class="line"><span>if (this.discountRate)</span></span>
<span class="line"><span>  base = base - (this.discountRate * base);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-5" tabindex="-1"><a class="header-anchor" href="#动机-5"><span>动机</span></a></h3><p>常常会有这样一段代码：只有当某个条件为真时，该段代码才能正常运行。例如，平方根计算只对正值才能进行，又例如，某个对象可能假设一组字段中至少有一个不等于 null。</p><p>这样的假设通常并没有在代码中明确表现出来，你必须阅读整个算法才能看出。有时程序员会以注释写出这样的假设，而我要介绍的是一种更好的技术——使用断言明确标明这些假设。</p><p>断言是一个条件表达式，应该总是为真。如果它失败，表示程序员犯了错误。断言的失败不应该被系统任何地方捕捉。整个程序的行为在有没有断言出现的时候都应该完全一样。实际上，有些编程语言中的断言可以在编译期用一个开关完全禁用掉。</p><p>我常看见有人鼓励用断言来发现程序中的错误。这固然是一件好事，但却不是使用断言的唯一理由。断言是一种很有价值的交流形式——它们告诉阅读者，程序在执行到这一点时，对当前状态做了何种假设。另外断言对调试也很有帮助。而且，因为它们在交流上很有价值，即使解决了当下正在追踪的错误，我还是倾向于把断言留着。自测试的代码降低了断言在调试方面的价值，因为逐步逼近的单元测试通常能更好地帮助调试，但我仍然看重断言在交流方面的价值。</p><h3 id="做法-5" tabindex="-1"><a class="header-anchor" href="#做法-5"><span>做法</span></a></h3><p>如果你发现代码假设某个条件始终为真，就加入一个断言明确说明这种情况。</p><p>因为断言应该不会对系统运行造成任何影响，所以“加入断言”永远都应该是行为保持的。</p><h3 id="范例-5" tabindex="-1"><a class="header-anchor" href="#范例-5"><span>范例</span></a></h3><p>下面是一个简单的例子：折扣。顾客（customer）会获得一个折扣率（discount rate），可以用于所有其购买的商品。</p><p><strong>class Customer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>applyDiscount(aNumber) {</span></span>
<span class="line"><span>  return (this.discountRate)</span></span>
<span class="line"><span>    ? aNumber - (this.discountRate * aNumber)</span></span>
<span class="line"><span>    : aNumber;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里有一个假设：折扣率永远是正数。我可以用断言明确标示出这个假设。但在一个三元表达式中没办法很简单地插入断言，所以我首先要把这个表达式转换成 if-else 的形式。</p><p><strong>class Customer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>applyDiscount(aNumber) {</span></span>
<span class="line"><span>  if (!this.discountRate) return aNumber;</span></span>
<span class="line"><span>  else return aNumber - (this.discountRate * aNumber);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我就可以轻松地加入断言了。</p><p><strong>class Customer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>applyDiscount(aNumber) {</span></span>
<span class="line"><span>  if (!this.discountRate) return aNumber;</span></span>
<span class="line"><span>  else {</span></span>
<span class="line"><span>    assert(this.discountRate &gt;= 0);</span></span>
<span class="line"><span>    return aNumber - (this.discountRate * aNumber);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对这个例子而言，我更愿意把断言放在设值函数上。如果在 applyDiscount 函数处发生断言失败，我还得先费力搞清楚非法的折扣率值起初是从哪儿放进去的。</p><p><strong>class Customer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>set discountRate(aNumber) {</span></span>
<span class="line"><span>  assert(null === aNumber || aNumber &gt;= 0);</span></span>
<span class="line"><span>  this._discountRate = aNumber;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>真正引起错误的源头有可能很难发现——也许是输入数据中误写了一个减号，也许是某处代码做数据转换时犯了错误。像这样的断言对于发现错误源头特别有帮助。</p><p>注意，不要滥用断言。我不会使用断言来检查所有“我认为应该为真”的条件，只用来检查“必须为真”的条件。滥用断言可能会造成代码重复，尤其是在处理上面这样的条件逻辑时。所以我发现，很有必要去掉条件逻辑中的重复，通常可以借助提炼函数（106）手法。</p><p>我只用断言预防程序员的错误。如果要从某个外部数据源读取数据，那么所有对输入值的检查都应该是程序的一等公民，而不能用断言实现——除非我对这个外部数据源有绝对的信心。断言是帮助我们跟踪 bug 的最后一招，所以，或许听来讽刺，只有当我认为断言绝对不会失败的时候，我才会使用断言。</p><hr><h1 id="_11-重构-api" tabindex="-1"><a class="header-anchor" href="#_11-重构-api"><span>11.重构 API</span></a></h1><p>模块和函数是软件的骨肉，而 API 则是将骨肉连接起来的关节。易于理解和使用的 API 非常重要，但同时也很难获得。随着对软件理解的加深，我会学到如何改进 API，这时我便需要对 API 进行重构。</p><p>好的 API 会把更新数据的函数与只是读取数据的函数清晰分开。如果我看到这两类操作被混在一起，就会用将查询函数和修改函数分离（306）将它们分开。如果两个函数的功能非常相似、只有一些数值不同，我可以用函数参数化（310）将其统一。但有些参数其实只是一个标记，根据这个标记的不同，函数会有截然不同的行为，此时最好用移除标记参数（314）将不同的行为彻底分开。</p><p>在函数间传递时，数据结构常会毫无必要地被拆开，我更愿意用保持对象完整（319）将其聚拢。函数需要的一份信息，究竟何时应该作为参数传入、何时应该调用一个函数获得，这是一个需要反复推敲的决定，推敲的过程中常常要用到以查询取代参数（324）和以参数取代查询（327）。</p><p>类是一种常见的模块形式。我希望尽可能保持对象不可变，所以只要有可能，我就会使用移除设值函数（331）。当调用者要求一个新对象时，我经常需要比构造函数更多的灵活性，可以借助以工厂函数取代构造函数（334）获得这种灵活性。</p><p>有时你会遇到一个特别复杂的函数，围绕着它传入传出一大堆数据。最后两个重构手法专门用于破解这个难题。我可以用以命令取代函数（337）将这个函数变成对象，这样对函数体使用提炼函数（106）时会更容易。如果稍后我对该函数做了简化，不再需要将其作为命令对象了，可以用以函数取代命令（344）再把它变回函数。</p><h2 id="_11-1-将查询函数和修改函数分离-separate-query-from-modifier" tabindex="-1"><a class="header-anchor" href="#_11-1-将查询函数和修改函数分离-separate-query-from-modifier"><span>11.1 将查询函数和修改函数分离（Separate Query from Modifier）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function getTotalOutstandingAndSendBill() {</span></span>
<span class="line"><span>const result = customer.invoices.reduce((total, each) =&gt; each.amount + total, 0);</span></span>
<span class="line"><span>sendBill();</span></span>
<span class="line"><span>return result;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>function totalOutstanding() {</span></span>
<span class="line"><span>return customer.invoices.reduce((total, each) =&gt; each.amount + total, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function sendBill() {</span></span>
<span class="line"><span>emailGateway.send(formatBill(customer));</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-6" tabindex="-1"><a class="header-anchor" href="#动机-6"><span>动机</span></a></h3><p>如果某个函数只是提供一个值，没有任何看得到的副作用，那么这是一个很有价值的东西。我可以任意调用这个函数，也可以把调用动作搬到调用函数的其他地方。这种函数的测试也更容易。简而言之，需要操心的事情少多了。</p><p>明确表现出“有副作用”与“无副作用”两种函数之间的差异，是个很好的想法。下面是一条好规则：任何有返回值的函数，都不应该有看得到的副作用——命令与查询分离（Command-Query Separation）[mf-cqs]。有些程序员甚至将此作为一条必须遵守的规则。就像对待任何东西一样，我并不绝对遵守它，不过我总是尽量遵守，而它也回报我很好的效果。</p><p>如果遇到一个“既有返回值又有副作用”的函数，我就会试着将查询动作从修改动作中分离出来。</p><p>你也许已经注意到了：我使用“看得到的副作用”这种说法。有一种常见的优化办法是：将查询所得结果缓存于某个字段中，这样一来后续的重复查询就可以大大加快速度。虽然这种做法改变了对象中缓存的状态，但这一修改是察觉不到的，因为不论如何查询，总是获得相同结果。</p><h3 id="做法-6" tabindex="-1"><a class="header-anchor" href="#做法-6"><span>做法</span></a></h3><p>复制整个函数，将其作为一个查询来命名。</p><p>如果想不出好名字，可以看看函数返回的是什么。查询的结果会被填入一个变量，这个变量的名字应该能对函数如何命名有所启发。</p><p>从新建的查询函数中去掉所有造成副作用的语句。</p><p>执行静态检查。</p><p>查找所有调用原函数的地方。如果调用处用到了该函数的返回值，就将其改为调用新建的查询函数，并在下面马上再调用一次原函数。每次修改之后都要测试。</p><p>从原函数中去掉返回值。</p><p>测试。</p><p>完成重构之后，查询函数与原函数之间常会有重复代码，可以做必要的清理。</p><h3 id="范例-6" tabindex="-1"><a class="header-anchor" href="#范例-6"><span>范例</span></a></h3><p>有这样一个函数：它会遍历一份恶棍（miscreant）名单，检查一群人（people）里是否混进了恶棍。如果发现了恶棍，该函数会返回恶棍的名字，并拉响警报。如果人群中有多名恶棍，该函数也只汇报找出的第一名恶棍（我猜这就已经够了）。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function alertForMiscreant(people) {</span></span>
<span class="line"><span>  for (const p of people) {</span></span>
<span class="line"><span>    if (p === &quot;Don&quot;) {</span></span>
<span class="line"><span>      setOffAlarms();</span></span>
<span class="line"><span>      return &quot;Don&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (p === &quot;John&quot;) {</span></span>
<span class="line"><span>      setOffAlarms();</span></span>
<span class="line"><span>      return &quot;John&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return &quot;&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>首先我复制整个函数，用它的查询部分功能为其命名。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function findMiscreant(people) {</span></span>
<span class="line"><span>  for (const p of people) {</span></span>
<span class="line"><span>    if (p === &quot;Don&quot;) {</span></span>
<span class="line"><span>      setOffAlarms();</span></span>
<span class="line"><span>      return &quot;Don&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (p === &quot;John&quot;) {</span></span>
<span class="line"><span>      setOffAlarms();</span></span>
<span class="line"><span>      return &quot;John&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return &quot;&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在新建的查询函数中去掉副作用。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function findMiscreant(people) {</span></span>
<span class="line"><span>  for (const p of people) {</span></span>
<span class="line"><span>    if (p === &quot;Don&quot;) {</span></span>
<span class="line"><span>      setOffAlarms();</span></span>
<span class="line"><span>      return &quot;Don&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (p === &quot;John&quot;) {</span></span>
<span class="line"><span>      setOffAlarms();</span></span>
<span class="line"><span>      return &quot;John&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return &quot;&quot;;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后找到所有原函数的调用者，将其改为调用新建的查询函数，并在其后调用一次修改函数（也就是原函数）。于是代码</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const found = alertForMiscreant(people);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>就变成了</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const found = findMiscreant(people);</span></span>
<span class="line"><span>alertForMiscreant(people);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>现在可以从修改函数中去掉所有返回值了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function alertForMiscreant(people) {</span></span>
<span class="line"><span>  for (const p of people) {</span></span>
<span class="line"><span>    if (p === &quot;Don&quot;) {</span></span>
<span class="line"><span>      setOffAlarms();</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (p === &quot;John&quot;) {</span></span>
<span class="line"><span>      setOffAlarms();</span></span>
<span class="line"><span>      return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  return;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，原来的修改函数和新建的查询函数之间有大量的重复代码，我可以使用替换算法（195），让修改函数使用查询函数。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function alertForMiscreant(people) {</span></span>
<span class="line"><span>  if (findMiscreant(people) !== &quot;&quot;) setOffAlarms();</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-2-函数参数化-parameterize-function" tabindex="-1"><a class="header-anchor" href="#_11-2-函数参数化-parameterize-function"><span>11.2 函数参数化（Parameterize Function）</span></a></h2><p>曾用名：令函数携带参数（Parameterize Method）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function tenPercentRaise(aPerson) {</span></span>
<span class="line"><span>  aPerson.salary = aPerson.salary.multiply(1.1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function fivePercentRaise(aPerson) {</span></span>
<span class="line"><span>  aPerson.salary = aPerson.salary.multiply(1.05);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function raise(aPerson, factor) {</span></span>
<span class="line"><span>  aPerson.salary = aPerson.salary.multiply(1 + factor);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-7" tabindex="-1"><a class="header-anchor" href="#动机-7"><span>动机</span></a></h3><p>如果我发现两个函数逻辑非常相似，只有一些字面量值不同，可以将其合并成一个函数，以参数的形式传入不同的值，从而消除重复。这个重构可以使函数更有用，因为重构后的函数还可以用于处理其他的值。</p><h3 id="做法-7" tabindex="-1"><a class="header-anchor" href="#做法-7"><span>做法</span></a></h3><p>从一组相似的函数中选择一个。</p><p>运用改变函数声明（124），把需要作为参数传入的字面量添加到参数列表中。</p><p>修改该函数所有的调用处，使其在调用时传入该字面量值。</p><p>测试。</p><p>修改函数体，令其使用新传入的参数。每使用一个新参数都要测试。</p><p>对于其他与之相似的函数，逐一将其调用处改为调用已经参数化的函数。每次修改后都要测试。</p><p>如果第一个函数经过参数化以后不能直接替代另一个与之相似的函数，就先对参数化之后的函数做必要的调整，再做替换。</p><h3 id="范例-7" tabindex="-1"><a class="header-anchor" href="#范例-7"><span>范例</span></a></h3><p>下面是一个显而易见的例子：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function tenPercentRaise(aPerson) {</span></span>
<span class="line"><span>  aPerson.salary = aPerson.salary.multiply(1.1);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function fivePercentRaise(aPerson) {</span></span>
<span class="line"><span>  aPerson.salary = aPerson.salary.multiply(1.05);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>很明显我可以用下面这个函数来替换上面两个：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function raise(aPerson, factor) {</span></span>
<span class="line"><span>  aPerson.salary = aPerson.salary.multiply(1 + factor);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>情况可能比这个更复杂一些。例如下列代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function baseCharge(usage) {</span></span>
<span class="line"><span> if (usage &lt; 0) return usd(0);</span></span>
<span class="line"><span> const amount =</span></span>
<span class="line"><span>    bottomBand(usage) * 0.03</span></span>
<span class="line"><span>    + middleBand(usage) * 0.05</span></span>
<span class="line"><span>    + topBand(usage) * 0.07;</span></span>
<span class="line"><span> return usd(amount);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function bottomBand(usage) {</span></span>
<span class="line"><span> return Math.min(usage, 100);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function middleBand(usage) {</span></span>
<span class="line"><span> return usage &gt; 100 ? Math.min(usage, 200) - 100 : 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function topBand(usage) {</span></span>
<span class="line"><span> return usage &gt; 200 ? usage - 200 : 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这几个函数中的逻辑明显很相似，但是不是相似到足以支撑一个参数化的计算“计费档次”（band）的函数？这次就不像前面第一个例子那样一目了然了。</p><p>在尝试对几个相关的函数做参数化操作时，我会先从中挑选一个，在上面添加参数，同时留意其他几种情况。在类似这样处理“范围”的情况下，通常从位于中间的范围开始着手较好。所以我首先选择了 middleBand 函数来添加参数，然后调整其他的调用者来适应它。</p><p>middleBand 使用了两个字面量值，即 100 和 200，分别代表“中间档次”的下界和上界。我首先用改变函数声明（124）加上这两个参数，同时顺手给函数改个名，使其更好地表述参数化之后的含义。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function withinBand(usage, bottom, top) {</span></span>
<span class="line"><span> return usage &gt; 100 ? Math.min(usage, 200) - 100 : 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function baseCharge(usage) {</span></span>
<span class="line"><span> if (usage &lt; 0) return usd(0);</span></span>
<span class="line"><span> const amount =</span></span>
<span class="line"><span>    bottomBand(usage) * 0.03</span></span>
<span class="line"><span>    + withinBand(usage, 100, 200) * 0.05</span></span>
<span class="line"><span>    + topBand(usage) * 0.07;</span></span>
<span class="line"><span> return usd(amount);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在函数体内部，把一个字面量改为使用新传入的参数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function withinBand(usage, bottom, top) {</span></span>
<span class="line"><span>  return usage &amp; gt;</span></span>
<span class="line"><span>  bottom ? Math.min(usage, 200) - bottom : 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是另一个：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function withinBand(usage, bottom, top) {</span></span>
<span class="line"><span>  return usage &amp; gt;</span></span>
<span class="line"><span>  bottom ? Math.min(usage, top) - bottom : 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于原本调用 bottomBand 函数的地方，我将其改为调用参数化了的新函数。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function baseCharge(usage) {</span></span>
<span class="line"><span> if (usage &lt; 0) return usd(0);</span></span>
<span class="line"><span> const amount =</span></span>
<span class="line"><span>    withinBand(usage, 0, 100) * 0.03</span></span>
<span class="line"><span>    + withinBand(usage, 100, 200) * 0.05</span></span>
<span class="line"><span>    + topBand(usage) * 0.07;</span></span>
<span class="line"><span> return usd(amount);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function bottomBand(usage) {</span></span>
<span class="line"><span> return Math.min(usage, 100);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了替换对 topBand 的调用，我就得用代表“无穷大”的 Infinity 作为这个范围的上界。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function baseCharge(usage) {</span></span>
<span class="line"><span> if (usage &lt; 0) return usd(0);</span></span>
<span class="line"><span> const amount =</span></span>
<span class="line"><span>    withinBand(usage, 0, 100) * 0.03</span></span>
<span class="line"><span>    + withinBand(usage, 100, 200) * 0.05</span></span>
<span class="line"><span>    + withinBand(usage, 200, Infinity) * 0.07;</span></span>
<span class="line"><span> return usd(amount);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function topBand(usage) {</span></span>
<span class="line"><span>  return usage &gt; 200 ? usage - 200 : 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>照现在的逻辑，baseCharge 一开始的卫语句已经可以去掉了。不过，尽管这条语句已经失去了逻辑上的必要性，我还是愿意把它留在原地，因为它阐明了“传入的 usage 参数为负数”这种情况是如何处理的。</p><h2 id="_11-3-移除标记参数-remove-flag-argument" tabindex="-1"><a class="header-anchor" href="#_11-3-移除标记参数-remove-flag-argument"><span>11.3 移除标记参数（Remove Flag Argument）</span></a></h2><p>曾用名：以明确函数取代参数（Replace Parameter with Explicit Methods）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function setDimension(name, value) {</span></span>
<span class="line"><span>  if (name === &quot;height&quot;) {</span></span>
<span class="line"><span>    this._height = value;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  if (name === &quot;width&quot;) {</span></span>
<span class="line"><span>    this._width = value;</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function setHeight(value) {</span></span>
<span class="line"><span>  this._height = value;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function setWidth(value) {</span></span>
<span class="line"><span>  this._width = value;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-8" tabindex="-1"><a class="header-anchor" href="#动机-8"><span>动机</span></a></h3><p>“标记参数”是这样的一种参数：调用者用它来指示被调函数应该执行哪一部分逻辑。例如，我可能有下面这样一个函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function bookConcert(aCustomer, isPremium) {</span></span>
<span class="line"><span>  if (isPremium) {</span></span>
<span class="line"><span>    // logic for premium booking</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    // logic for regular booking</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>要预订一场高级音乐会（premium concert），就得这样发起调用：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>bookConcert(aCustomer, true);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>标记参数也可能以枚举的形式出现：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>bookConcert(aCustomer, CustomerType.PREMIUM);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>或者是以字符串（或者符号，如果编程语言支持的话）的形式出现：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>bookConcert(aCustomer, &quot;premium&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>我不喜欢标记参数，因为它们让人难以理解到底有哪些函数可以调用、应该怎么调用。拿到一份 API 以后，我首先看到的是一系列可供调用的函数，但标记参数却隐藏了函数调用中存在的差异性。使用这样的函数，我还得弄清标记参数有哪些可用的值。布尔型的标记尤其糟糕，因为它们不能清晰地传达其含义——在调用一个函数时，我很难弄清 true 到底是什么意思。如果明确用一个函数来完成一项单独的任务，其含义会清晰得多。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>premiumBookConcert(aCustomer);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>并非所有类似这样的参数都是标记参数。如果调用者传入的是程序中流动的数据，这样的参数不算标记参数；只有调用者直接传入字面量值，这才是标记参数。另外，在函数实现内部，如果参数值只是作为数据传给其他函数，这就不是标记参数；只有参数值影响了函数内部的控制流，这才是标记参数。</p><p>移除标记参数不仅使代码更整洁，并且能帮助开发工具更好地发挥作用。去掉标记参数后，代码分析工具能更容易地体现出“高级”和“普通”两种预订逻辑在使用时的区别。</p><p>如果一个函数有多个标记参数，可能就不得不将其保留，否则我就得针对各个参数的各种取值的所有组合情况提供明确函数。不过这也是一个信号，说明这个函数可能做得太多，应该考虑是否能用更简单的函数来组合出完整的逻辑。</p><h3 id="做法-8" tabindex="-1"><a class="header-anchor" href="#做法-8"><span>做法</span></a></h3><p>针对参数的每一种可能值，新建一个明确函数。</p><p>如果主函数有清晰的条件分发逻辑，可以用分解条件表达式（260）创建明确函数；否则，可以在原函数之上创建包装函数。</p><p>对于“用字面量值作为参数”的函数调用者，将其改为调用新建的明确函数。</p><h3 id="范例-8" tabindex="-1"><a class="header-anchor" href="#范例-8"><span>范例</span></a></h3><p>在浏览代码时，我发现多处代码在调用一个函数计算物流（shipment）的到货日期（delivery date）。一些调用代码类似这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>aShipment.deliveryDate = deliveryDate(anOrder, true);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>另一些调用代码则是这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>aShipment.deliveryDate = deliveryDate(anOrder, false);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>面对这样的代码，我立即开始好奇：参数里这个布尔值是什么意思？是用来干什么的？</p><p>deliveryDate 函数主体如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function deliveryDate(anOrder, isRush) {</span></span>
<span class="line"><span>  if (isRush) {</span></span>
<span class="line"><span>    let deliveryTime;</span></span>
<span class="line"><span>    if ([&quot;MA&quot;, &quot;CT&quot;].includes(anOrder.deliveryState)) deliveryTime = 1;</span></span>
<span class="line"><span>    else if ([&quot;NY&quot;, &quot;NH&quot;].includes(anOrder.deliveryState)) deliveryTime = 2;</span></span>
<span class="line"><span>    else deliveryTime = 3;</span></span>
<span class="line"><span>    return anOrder.placedOn.plusDays(1 + deliveryTime);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    let deliveryTime;</span></span>
<span class="line"><span>    if ([&quot;MA&quot;, &quot;CT&quot;, &quot;NY&quot;].includes(anOrder.deliveryState)) deliveryTime = 2;</span></span>
<span class="line"><span>    else if ([&quot;ME&quot;, &quot;NH&quot;].includes(anOrder.deliveryState)) deliveryTime = 3;</span></span>
<span class="line"><span>    else deliveryTime = 4;</span></span>
<span class="line"><span>    return anOrder.placedOn.plusDays(2 + deliveryTime);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原来调用者用这个布尔型字面量来判断应该运行哪个分支的代码——典型的标记参数。然而函数的重点就在于要遵循调用者的指令，所以最好是用明确函数的形式明确说出调用者的意图。</p><p>对于这个例子，我可以使用分解条件表达式（260），得到下列代码：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function deliveryDate(anOrder, isRush) {</span></span>
<span class="line"><span>  if (isRush) return rushDeliveryDate(anOrder);</span></span>
<span class="line"><span>  else return regularDeliveryDate(anOrder);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function rushDeliveryDate(anOrder) {</span></span>
<span class="line"><span>  let deliveryTime;</span></span>
<span class="line"><span>  if ([&quot;MA&quot;, &quot;CT&quot;].includes(anOrder.deliveryState)) deliveryTime = 1;</span></span>
<span class="line"><span>  else if ([&quot;NY&quot;, &quot;NH&quot;].includes(anOrder.deliveryState)) deliveryTime = 2;</span></span>
<span class="line"><span>  else deliveryTime = 3;</span></span>
<span class="line"><span>  return anOrder.placedOn.plusDays(1 + deliveryTime);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function regularDeliveryDate(anOrder) {</span></span>
<span class="line"><span>  let deliveryTime;</span></span>
<span class="line"><span>  if ([&quot;MA&quot;, &quot;CT&quot;, &quot;NY&quot;].includes(anOrder.deliveryState)) deliveryTime = 2;</span></span>
<span class="line"><span>  else if ([&quot;ME&quot;, &quot;NH&quot;].includes(anOrder.deliveryState)) deliveryTime = 3;</span></span>
<span class="line"><span>  else deliveryTime = 4;</span></span>
<span class="line"><span>  return anOrder.placedOn.plusDays(2 + deliveryTime);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这两个函数能更好地表达调用者的意图，现在我可以修改调用方代码了。调用代码</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>aShipment.deliveryDate = deliveryDate(anOrder, true);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>可以改为</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>aShipment.deliveryDate = rushDeliveryDate(anOrder);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>另一个分支也类似。</p><p>处理完所有调用处，我就可以移除 deliveryDate 函数。</p><p>这个参数是标记参数，不仅因为它是布尔类型，而且还因为调用方以字面量的形式直接设置参数值。如果所有调用 deliveryDate 的代码都像这样：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const isRush = determineIfRush(anOrder);</span></span>
<span class="line"><span>aShipment.deliveryDate = deliveryDate(anOrder, isRush);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>那我对这个函数的签名没有任何意见（不过我还是想用分解条件表达式（260）清理其内部实现）。</p><p>可能有一些调用者给这个参数传入的是字面量，将其作为标记参数使用；另一些调用者则传入正常的数据。若果真如此，我还是会使用移除标记参数（314），但不修改传入正常数据的调用者，重构结束时也不删除 deliveryDate 函数。这样我就提供了两套接口，分别支持不同的用途。</p><p>直接拆分条件逻辑是实施本重构的好方法，但只有当“根据参数值做分发”的逻辑发生在函数最外层（或者可以比较容易地将其重构至函数最外层）的时候，这一招才好用。函数内部也有可能以一种更纠结的方式使用标记参数，例如下面这个版本的 deliveryDate 函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function deliveryDate(anOrder, isRush) {</span></span>
<span class="line"><span> let result;</span></span>
<span class="line"><span> let deliveryTime;</span></span>
<span class="line"><span> if (anOrder.deliveryState === &quot;MA&quot; || anOrder.deliveryState === &quot;CT&quot;)</span></span>
<span class="line"><span>  deliveryTime = isRush? 1 : 2;</span></span>
<span class="line"><span> else if (anOrder.deliveryState === &quot;NY&quot; || anOrder.deliveryState === &quot;NH&quot;) {</span></span>
<span class="line"><span>  deliveryTime = 2;</span></span>
<span class="line"><span>  if (anOrder.deliveryState === &quot;NH&quot; &amp;amp;&amp;amp; !isRush)</span></span>
<span class="line"><span>   deliveryTime = 3;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> else if (isRush)</span></span>
<span class="line"><span>  deliveryTime = 3;</span></span>
<span class="line"><span> else if (anOrder.deliveryState === &quot;ME&quot;)</span></span>
<span class="line"><span>  deliveryTime = 3;</span></span>
<span class="line"><span> else</span></span>
<span class="line"><span>  deliveryTime = 4;</span></span>
<span class="line"><span> result = anOrder.placedOn.plusDays(2 + deliveryTime);</span></span>
<span class="line"><span> if (isRush) result = result.minusDays(1);</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种情况下，想把围绕 isRush 的分发逻辑剥离到顶层，需要的工作量可能会很大。所以我选择退而求其次，在 deliveryDate 之上添加两个函数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function rushDeliveryDate(anOrder) {</span></span>
<span class="line"><span>  return deliveryDate(anOrder, true);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>function regularDeliveryDate(anOrder) {</span></span>
<span class="line"><span>  return deliveryDate(anOrder, false);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>本质上，这两个包装函数分别代表了 deliveryDate 函数一部分的使用方式。不过它们并非从原函数中拆分而来，而是用代码文本强行定义的。</p><p>随后，我同样可以逐一替换原函数的调用者，就跟前面分解条件表达式之后的处理一样。如果没有任何一个调用者向 isRush 参数传入正常的数据，我最后会限制原函数的可见性，或是将其改名（例如改为 deliveryDateHelperOnly），让人一见即知不应直接使用这个函数。</p><h2 id="_11-4-保持对象完整-preserve-whole-object" tabindex="-1"><a class="header-anchor" href="#_11-4-保持对象完整-preserve-whole-object"><span>11.4 保持对象完整（Preserve Whole Object）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const low = aRoom.daysTempRange.low;</span></span>
<span class="line"><span>const high = aRoom.daysTempRange.high;</span></span>
<span class="line"><span>if (aPlan.withinRange(low, high))</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (aPlan.withinRange(aRoom.daysTempRange))</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-9" tabindex="-1"><a class="header-anchor" href="#动机-9"><span>动机</span></a></h3><p>如果我看见代码从一个记录结构中导出几个值，然后又把这几个值一起传递给一个函数，我会更愿意把整个记录传给这个函数，在函数体内部导出所需的值。</p><p>“传递整个记录”的方式能更好地应对变化：如果将来被调的函数需要从记录中导出更多的数据，我就不用为此修改参数列表。并且传递整个记录也能缩短参数列表，让函数调用更容易看懂。如果有很多函数都在使用记录中的同一组数据，处理这部分数据的逻辑常会重复，此时可以把这些处理逻辑搬移到完整对象中去。</p><p>也有时我不想采用本重构手法，因为我不想让被调函数依赖完整对象，尤其是在两者不在同一个模块中的时候。</p><p>从一个对象中抽取出几个值，单独对这几个值做某些逻辑操作，这是一种代码坏味道（依恋情结），通常标志着这段逻辑应该被搬移到对象中。保持对象完整经常发生在引入参数对象（140）之后，我会搜寻使用原来的数据泥团的代码，代之以使用新的对象。</p><p>如果几处代码都在使用对象的一部分功能，可能意味着应该用提炼类（182）把这一部分功能单独提炼出来。</p><p>还有一种常被忽视的情况：调用者将自己的若干数据作为参数，传递给被调用函数。这种情况下，我可以将调用者的自我引用（在 JavaScript 中就是 this）作为参数，直接传递给目标函数。</p><h3 id="做法-9" tabindex="-1"><a class="header-anchor" href="#做法-9"><span>做法</span></a></h3><p>新建一个空函数，给它以期望中的参数列表（即传入完整对象作为参数）。</p><p>给这个函数起一个容易搜索的名字，这样到重构结束时方便替换。</p><p>在新函数体内调用旧函数，并把新的参数（即完整对象）映射到旧的参数列表（即来源于完整对象的各项数据）。</p><p>执行静态检查。</p><p>逐一修改旧函数的调用者，令其使用新函数，每次修改之后执行测试。</p><p>修改之后，调用处用于“从完整对象中导出参数值”的代码可能就没用了，可以用移除死代码（237）去掉。</p><p>所有调用处都修改过来之后，使用内联函数（115）把旧函数内联到新函数体内。</p><p>给新函数改名，从重构开始时的容易搜索的临时名字，改为使用旧函数的名字，同时修改所有调用处。</p><h3 id="范例-9" tabindex="-1"><a class="header-anchor" href="#范例-9"><span>范例</span></a></h3><p>我们想象一个室温监控系统，它负责记录房间一天中的最高温度和最低温度，然后将实际的温度范围与预先规定的温度控制计划（heating plan）相比较，如果当天温度不符合计划要求，就发出警告。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const low = aRoom.daysTempRange.low;</span></span>
<span class="line"><span>const high = aRoom.daysTempRange.high;</span></span>
<span class="line"><span>if (!aPlan.withinRange(low, high))</span></span>
<span class="line"><span>  alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>withinRange(bottom, top) {</span></span>
<span class="line"><span> return (bottom &gt;= this._temperatureRange.low) &amp;amp;&amp;amp; (top &lt;= this._temperatureRange.high);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实我不必将“温度范围”的信息拆开来单独传递，只需将整个范围对象传递给 withinRange 函数即可。</p><p>首先，我在 HeatingPlan 类中新添一个空函数，给它赋予我认为合理的参数列表。</p><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>xxNEWwithinRange(aNumberRange) {</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>因为这个函数最终要取代现有的 withinRange 函数，所以它也用了同样的名字，再加上一个容易替换的前缀。</p><p>然后在新函数体内调用现有的 withinRange 函数。因此，新函数体就完成了从新参数列表到旧函数参数列表的映射。</p><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>xxNEWwithinRange(aNumberRange) {</span></span>
<span class="line"><span>  return this.withinRange(aNumberRange.low, aNumberRange.high);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在开始正式的替换工作了，我要找到调用现有函数的地方，将其改为调用新函数。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const low = aRoom.daysTempRange.low;</span></span>
<span class="line"><span>const high = aRoom.daysTempRange.high;</span></span>
<span class="line"><span>if (!aPlan.xxNEWwithinRange(aRoom.daysTempRange))</span></span>
<span class="line"><span>  alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在修改调用处时，我可能会发现一些代码在修改后已经不再需要，此时可以使用移除死代码（237）。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const low = aRoom.daysTempRange.low;</span></span>
<span class="line"><span>const high = aRoom.daysTempRange.high;</span></span>
<span class="line"><span>if (!aPlan.xxNEWwithinRange(aRoom.daysTempRange))</span></span>
<span class="line"><span>  alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每次替换一处调用代码，每次修改后都要测试。</p><p>调用处全部替换完成后，用内联函数（115）将旧函数内联到新函数体内。</p><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>xxNEWwithinRange(aNumberRange) {</span></span>
<span class="line"><span> return (aNumberRange.low &gt;= this._temperatureRange.low) &amp;amp;&amp;amp;</span></span>
<span class="line"><span>  (aNumberRange.high &lt;= this._temperatureRange.high);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>终于可以去掉新函数那难看的前缀了，记得同时修改所有调用者。就算我所使用的开发环境不支持可靠的函数改名操作，有这个极具特色的前缀在，我也可以很方便地全局替换。</p><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>withinRange(aNumberRange) {</span></span>
<span class="line"><span> return (aNumberRange.low &gt;= this._temperatureRange.low) &amp;amp;&amp;amp;</span></span>
<span class="line"><span>  (aNumberRange.high &lt;= this._temperatureRange.high);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (!aPlan.withinRange(aRoom.daysTempRange))</span></span>
<span class="line"><span>  alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="范例-换个方式创建新函数" tabindex="-1"><a class="header-anchor" href="#范例-换个方式创建新函数"><span>范例：换个方式创建新函数</span></a></h3><p>在上面的示例中，我直接编写了新函数。大多数时候，这一步非常简单，也是创建新函数最容易的方式。不过有时还会用到另一种方式：可以完全通过重构手法的组合来得到新函数。</p><p>我从一处调用现有函数的代码开始。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const low = aRoom.daysTempRange.low;</span></span>
<span class="line"><span>const high = aRoom.daysTempRange.high;</span></span>
<span class="line"><span>if (!aPlan.withinRange(low, high))</span></span>
<span class="line"><span>  alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我要先对代码做一些整理，以便用提炼函数（106）来创建新函数。目前的调用者代码还不具备可提炼的函数雏形，不过我可以先做几次提炼变量（119），使其轮廓显现出来。首先，我要把对旧函数的调用从条件判断中解放出来。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const low = aRoom.daysTempRange.low;</span></span>
<span class="line"><span>const high = aRoom.daysTempRange.high;</span></span>
<span class="line"><span>const isWithinRange = aPlan.withinRange(low, high);</span></span>
<span class="line"><span>if (!isWithinRange) alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后把输入参数也提炼出来。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const tempRange = aRoom.daysTempRange;</span></span>
<span class="line"><span>const low = tempRange.low;</span></span>
<span class="line"><span>const high = tempRange.high;</span></span>
<span class="line"><span>const isWithinRange = aPlan.withinRange(low, high);</span></span>
<span class="line"><span>if (!isWithinRange) alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完成这一步之后，就可以用提炼函数（106）来创建新函数。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const tempRange = aRoom.daysTempRange;</span></span>
<span class="line"><span>const isWithinRange = xxNEWwithinRange(aPlan, tempRange);</span></span>
<span class="line"><span>if (!isWithinRange) alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>顶层作用域...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function xxNEWwithinRange(aPlan, tempRange) {</span></span>
<span class="line"><span>  const low = tempRange.low;</span></span>
<span class="line"><span>  const high = tempRange.high;</span></span>
<span class="line"><span>  const isWithinRange = aPlan.withinRange(low, high);</span></span>
<span class="line"><span>  return isWithinRange;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于旧函数属于另一个上下文（HeatingPlan 类），我需要用搬移函数（198）把新函数也搬过去。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const tempRange = aRoom.daysTempRange;</span></span>
<span class="line"><span>const isWithinRange = aPlan.xxNEWwithinRange(tempRange);</span></span>
<span class="line"><span>if (!isWithinRange) alerts.push(&quot;room temperature went outside range&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>xxNEWwithinRange(tempRange) {</span></span>
<span class="line"><span>  const low = tempRange.low;</span></span>
<span class="line"><span>  const high = tempRange.high;</span></span>
<span class="line"><span>  const isWithinRange = this.withinRange(low, high);</span></span>
<span class="line"><span>  return isWithinRange;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>剩下的过程就跟前面一样了：替换其他调用者，然后把旧函数内联到新函数中。重构刚开始的时候，为了清晰分离函数调用，以便提炼出新函数，我提炼了几个变量出来，现在可以把这些变量也内联回去。</p><p>这种方式的好处在于：它完全是由其他重构手法组合而成的。如果我使用的开发工具支持可靠的提炼和内联操作，用这种方式进行本重构会特别流畅。</p><h2 id="_11-5-以查询取代参数-replace-parameter-with-query" tabindex="-1"><a class="header-anchor" href="#_11-5-以查询取代参数-replace-parameter-with-query"><span>11.5 以查询取代参数（Replace Parameter with Query）</span></a></h2><p>曾用名：以函数取代参数（Replace Parameter with Method）</p><p>反向重构：以参数取代查询（327）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>availableVacation(anEmployee, anEmployee.grade);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function availableVacation(anEmployee, grade) {</span></span>
<span class="line"><span>  // calculate vacation...</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  availableVacation(anEmployee)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function availableVacation(anEmployee) {</span></span>
<span class="line"><span>  const grade = anEmployee.grade;</span></span>
<span class="line"><span>  // calculate vacation...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-10" tabindex="-1"><a class="header-anchor" href="#动机-10"><span>动机</span></a></h3><p>函数的参数列表应该总结该函数的可变性，标示出函数可能体现出行为差异的主要方式。和任何代码中的语句一样，参数列表应该尽量避免重复，并且参数列表越短就越容易理解。</p><p>如果调用函数时传入了一个值，而这个值由函数自己来获得也是同样容易，这就是重复。这个本不必要的参数会增加调用者的难度，因为它不得不找出正确的参数值，其实原本调用者是不需要费这个力气的。</p><p>“同样容易”四个字，划出了一条判断的界限。去除参数也就意味着“获得正确的参数值”的责任被转移：有参数传入时，调用者需要负责获得正确的参数值；参数去除后，责任就被转移给了函数本身。一般而言，我习惯于简化调用方，因此我愿意把责任移交给函数本身，但如果函数难以承担这份责任，就另当别论了。</p><p>不使用以查询取代参数最常见的原因是，移除参数可能会给函数体增加不必要的依赖关系——迫使函数访问某个程序元素，而我原本不想让函数了解这个元素的存在。这种“不必要的依赖关系”除了新增的以外，也可能是我想要稍后去除的，例如为了去除一个参数，我可能会在函数体内调用一个有问题的函数，或是从一个对象中获取某些原本想要剥离出去的数据。在这些情况下，都应该慎重考虑使用以查询取代参数。</p><p>如果想要去除的参数值只需要向另一个参数查询就能得到，这是使用以查询取代参数最安全的场景。如果可以从一个参数推导出另一个参数，那么几乎没有任何理由要同时传递这两个参数。</p><p>另外有一件事需要留意：如果在处理的函数具有引用透明性（referential transparency，即，不论任何时候，只要传入相同的参数值，该函数的行为永远一致），这样的函数既容易理解又容易测试，我不想使其失去这种优秀品质。我不会去掉它的参数，让它去访问一个可变的全局变量。</p><h3 id="做法-10" tabindex="-1"><a class="header-anchor" href="#做法-10"><span>做法</span></a></h3><p>如果有必要，使用提炼函数（106）将参数的计算过程提炼到一个独立的函数中。</p><p>将函数体内引用该参数的地方改为调用新建的函数。每次修改后执行测试。</p><p>全部替换完成后，使用改变函数声明（124）将该参数去掉。</p><h3 id="范例-10" tabindex="-1"><a class="header-anchor" href="#范例-10"><span>范例</span></a></h3><p>某些重构会使参数不再被需要，这是我最常用到以查询取代参数的场合。考虑下列代码。</p><p><strong>class Order...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get finalPrice() {</span></span>
<span class="line"><span> const basePrice = this.quantity * this.itemPrice;</span></span>
<span class="line"><span> let discountLevel;</span></span>
<span class="line"><span> if (this.quantity &gt; 100) discountLevel = 2;</span></span>
<span class="line"><span> else discountLevel = 1;</span></span>
<span class="line"><span> return this.discountedPrice(basePrice, discountLevel);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>discountedPrice(basePrice, discountLevel) {</span></span>
<span class="line"><span> switch (discountLevel) {</span></span>
<span class="line"><span>  case 1: return basePrice * 0.95;</span></span>
<span class="line"><span>  case 2: return basePrice * 0.9;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在简化函数逻辑时，我总是热衷于使用以查询取代临时变量（178），于是就得到了如下代码。</p><p><strong>class Order...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get finalPrice() {</span></span>
<span class="line"><span> const basePrice = this.quantity * this.itemPrice;</span></span>
<span class="line"><span> return this.discountedPrice(basePrice, this.discountLevel);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>get discountLevel() {</span></span>
<span class="line"><span> return (this.quantity &gt; 100) ? 2 : 1;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这一步，已经不需要再把 discountLevel 的计算结果传给 discountedPrice 了，后者可以自己调用 discountLevel 函数，不会增加任何难度。</p><p>因此，我把 discountedPrice 函数中用到这个参数的地方全都改为直接调用 discountLevel 函数。</p><p><strong>class Order...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>discountedPrice(basePrice, discountLevel) {</span></span>
<span class="line"><span> switch (this.discountLevel) {</span></span>
<span class="line"><span>  case 1: return basePrice * 0.95;</span></span>
<span class="line"><span>  case 2: return basePrice * 0.9;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后用改变函数声明（124）手法移除该参数。</p><p><strong>class Order...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get finalPrice() {</span></span>
<span class="line"><span> const basePrice = this.quantity * this.itemPrice;</span></span>
<span class="line"><span> return this.discountedPrice(basePrice, this.discountLevel);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>discountedPrice(basePrice, discountLevel) {</span></span>
<span class="line"><span> switch (this.discountLevel) {</span></span>
<span class="line"><span>  case 1: return basePrice * 0.95;</span></span>
<span class="line"><span>  case 2: return basePrice * 0.9;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-6-以参数取代查询-replace-query-with-parameter" tabindex="-1"><a class="header-anchor" href="#_11-6-以参数取代查询-replace-query-with-parameter"><span>11.6 以参数取代查询（Replace Query with Parameter）</span></a></h2><p>反向重构：以查询取代参数（324）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>  targetTemperature(aPlan)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function targetTemperature(aPlan) {</span></span>
<span class="line"><span>  currentTemperature = thermostat.currentTemperature;</span></span>
<span class="line"><span>  // rest of function...</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  targetTemperature(aPlan, thermostat.currentTemperature)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function targetTemperature(aPlan, currentTemperature) {</span></span>
<span class="line"><span>  // rest of function...</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-11" tabindex="-1"><a class="header-anchor" href="#动机-11"><span>动机</span></a></h3><p>在浏览函数实现时，我有时会发现一些令人不快的引用关系，例如，引用一个全局变量，或者引用另一个我想要移除的元素。为了解决这些令人不快的引用，我需要将其替换为函数参数，从而将处理引用关系的责任转交给函数的调用者。</p><p>需要使用本重构的情况大多源于我想要改变代码的依赖关系——为了让目标函数不再依赖于某个元素，我把这个元素的值以参数形式传递给该函数。这里需要注意权衡：如果把所有依赖关系都变成参数，会导致参数列表冗长重复；如果作用域之间的共享太多，又会导致函数间依赖过度。我一向不善于微妙的权衡，所以“能够可靠地改变决定”就显得尤为重要，这样随着我的理解加深，程序也能从中受益。</p><p>如果一个函数用同样的参数调用总是给出同样的结果，我们就说这个函数具有“引用透明性”（referential transparency），这样的函数理解起来更容易。如果一个函数使用了另一个元素，而后者不具引用透明性，那么包含该元素的函数也就失去了引用透明性。只要把“不具引用透明性的元素”变成参数传入，函数就能重获引用透明性。虽然这样就把责任转移给了函数的调用者，但是具有引用透明性的模块能带来很多益处。有一个常见的模式：在负责逻辑处理的模块中只有纯函数，其外再包裹处理 I/O 和其他可变元素的逻辑代码。借助以参数取代查询，我可以提纯程序的某些组成部分，使其更容易测试、更容易理解。</p><p>不过以参数取代查询并非只有好处。把查询变成参数以后，就迫使调用者必须弄清如何提供正确的参数值，这会增加函数调用者的复杂度，而我在设计接口时通常更愿意让接口的消费者更容易使用。归根到底，这是关于程序中责任分配的问题，而这方面的决策既不容易，也不会一劳永逸——这就是我需要非常熟悉本重构（及其反向重构）的原因。</p><h3 id="做法-11" tabindex="-1"><a class="header-anchor" href="#做法-11"><span>做法</span></a></h3><p>对执行查询操作的代码使用提炼变量（119），将其从函数体中分离出来。</p><p>现在函数体代码已经不再执行查询操作（而是使用前一步提炼出的变量），对这部分代码使用提炼函数（106）。</p><p>给提炼出的新函数起一个容易搜索的名字，以便稍后改名。</p><p>使用内联变量（123），消除刚才提炼出来的变量。</p><p>对原来的函数使用内联函数（115）。</p><p>对新函数改名，改回原来函数的名字。</p><h3 id="范例-11" tabindex="-1"><a class="header-anchor" href="#范例-11"><span>范例</span></a></h3><p>我们想象一个简单却又烦人的温度控制系统。用户可以从一个温控终端（thermostat）指定温度，但指定的目标温度必须在温度控制计划（heating plan）允许的范围内。</p><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get targetTemperature() {</span></span>
<span class="line"><span>  if (thermostat.selectedTemperature &gt; this._max) return this._max;</span></span>
<span class="line"><span>  else if (thermostat.selectedTemperature &lt; this._min) return this._min;</span></span>
<span class="line"><span>  else return thermostat.selectedTemperature;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (thePlan.targetTemperature &gt; thermostat.currentTemperature) setToHeat();</span></span>
<span class="line"><span>else if (thePlan.targetTemperature&lt;thermostat.currentTemperature)setToCool();</span></span>
<span class="line"><span>else setOff();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>系统的温控计划规则抑制了我的要求，作为这样一个系统的用户，我可能会感到很烦恼。不过作为程序员，我更担心的是 targetTemperature 函数依赖于全局的 thermostat 对象。我可以把需要这个对象提供的信息作为参数传入，从而打破对该对象的依赖。</p><p>首先，我要用提炼变量（119）把“希望作为参数传入的信息”提炼出来。</p><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get targetTemperature() {</span></span>
<span class="line"><span> const selectedTemperature = thermostat.selectedTemperature;</span></span>
<span class="line"><span> if      (selectedTemperature &gt; this._max) return this._max;</span></span>
<span class="line"><span> else if (selectedTemperature &lt; this._min) return this._min;</span></span>
<span class="line"><span> else return selectedTemperature;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样可以比较容易地用提炼函数（106）把整个函数体提炼出来，只剩“计算参数值”的逻辑还在原地。</p><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get targetTemperature() {</span></span>
<span class="line"><span> const selectedTemperature = thermostat.selectedTemperature;</span></span>
<span class="line"><span> return this.xxNEWtargetTemperature(selectedTemperature);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>xxNEWtargetTemperature(selectedTemperature) {</span></span>
<span class="line"><span> if      (selectedTemperature &gt; this._max) return this._max;</span></span>
<span class="line"><span> else if (selectedTemperature &lt; this._min) return this._min;</span></span>
<span class="line"><span> else return selectedTemperature;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后把刚才提炼出来的变量内联回去，于是旧函数就只剩一个简单的调用。</p><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get targetTemperature() {</span></span>
<span class="line"><span>  return this.xxNEWtargetTemperature(thermostat.selectedTemperature);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在可以对其使用内联函数（115）。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (thePlan.xxNEWtargetTemperature(thermostat.selectedTemperature) &gt;</span></span>
<span class="line"><span>   thermostat.currentTemperature)</span></span>
<span class="line"><span> setToHeat();</span></span>
<span class="line"><span>else if (thePlan.xxNEWtargetTemperature(thermostat.selectedTemperature) &lt;</span></span>
<span class="line"><span>     thermostat.currentTemperature)</span></span>
<span class="line"><span> setToCool();</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> setOff();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再把新函数改名，用回旧函数的名字。得益于之前给它起了一个容易搜索的名字，现在只要把前缀去掉就行。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>if (thePlan.targetTemperature(thermostat.selectedTemperature) &gt;</span></span>
<span class="line"><span>   thermostat.currentTemperature)</span></span>
<span class="line"><span> setToHeat();</span></span>
<span class="line"><span>else if (thePlan.targetTemperature(thermostat.selectedTemperature) &lt;</span></span>
<span class="line"><span>     thermostat.currentTemperature)</span></span>
<span class="line"><span> setToCool();</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span> setOff();</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class HeatingPlan...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>targetTemperature(selectedTemperature) {</span></span>
<span class="line"><span> if (selectedTemperature &gt; this._max) return this._max;</span></span>
<span class="line"><span> else if (selectedTemperature &lt; this._min) return this._min;</span></span>
<span class="line"><span> else return selectedTemperature;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用方的代码看起来比重构之前更笨重了，这是使用本重构手法的常见情况。将一个依赖关系从一个模块中移出，就意味着将处理这个依赖关系的责任推回给调用者。这是为了降低耦合度而付出的代价。</p><p>但是，去除对 thermostat 对象的耦合，并不是本重构带来的唯一收益。HeatingPlan 类本身是不可变的——字段的值都在构造函数中设置，任何函数都不会修改它们。（不用费心去查看整个类的代码，相信我就好。）在不可变的 HeatingPlan 基础上，把对 thermostat 的依赖移出函数体之后，我又使 targetTemperature 函数具备了引用透明性。从此以后，只要在同一个 HeatingPlan 对象上用同样的参数调用 targetTemperature 函数，我会始终得到同样的结果。如果 HeatingPlan 的所有函数都具有引用透明性，这个类会更容易测试，其行为也更容易理解。</p><p>JavaScript 的类模型有一个问题：无法强制要求类的不可变性——始终有办法修改对象的内部数据。尽管如此，在编写一个类的时候明确说明并鼓励不可变性，通常也就足够了。尽量让类保持不可变通常是一个好的策略，以参数取代查询则是达成这一策略的利器。</p><h2 id="_11-7-移除设值函数-remove-setting-method" tabindex="-1"><a class="header-anchor" href="#_11-7-移除设值函数-remove-setting-method"><span>11.7 移除设值函数（Remove Setting Method）</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>class Person {</span></span>
<span class="line"><span>get name() {...}</span></span>
<span class="line"><span>set name(aString) {...}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Person {</span></span>
<span class="line"><span>get name() {...}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-12" tabindex="-1"><a class="header-anchor" href="#动机-12"><span>动机</span></a></h3><p>如果为某个字段提供了设值函数，这就暗示这个字段可以被改变。如果不希望在对象创建之后此字段还有机会被改变，那就不要为它提供设值函数（同时将该字段声明为不可变）。这样一来，该字段就只能在构造函数中赋值，我“不想让它被修改”的意图会更加清晰，并且可以排除其值被修改的可能性——这种可能性往往是非常大的。</p><p>有两种常见的情况需要讨论。一种情况是，有些人喜欢始终通过访问函数来读写字段值，包括在构造函数内也是如此。这会导致构造函数成为设值函数的唯一使用者。若果真如此，我更愿意去除设值函数，清晰地表达“构造之后不应该再更新字段值”的意图。</p><p>另一种情况是，对象是由客户端通过创建脚本构造出来，而不是只有一次简单的构造函数调用。所谓“创建脚本”，首先是调用构造函数，然后就是一系列设值函数的调用，共同完成新对象的构造。创建脚本执行完以后，这个新生对象的部分（乃至全部）字段就不应该再被修改。设值函数只应该在起初的对象创建过程中调用。对于这种情况，我也会想办法去除设值函数，更清晰地表达我的意图。</p><h3 id="做法-12" tabindex="-1"><a class="header-anchor" href="#做法-12"><span>做法</span></a></h3><p>如果构造函数尚无法得到想要设入字段的值，就使用改变函数声明（124）将这个值以参数的形式传入构造函数。在构造函数中调用设值函数，对字段设值。</p><p>如果想移除多个设值函数，可以一次性把它们的值都传入构造函数，这能简化后续步骤。</p><p>移除所有在构造函数之外对设值函数的调用，改为使用新的构造函数。每次修改之后都要测试。</p><p>如果不能把“调用设值函数”替换为“创建一个新对象”（例如你需要更新一个多处共享引用的对象），请放弃本重构。</p><p>使用内联函数（115）消去设值函数。如果可能的话，把字段声明为不可变。</p><p>测试。</p><h3 id="范例-12" tabindex="-1"><a class="header-anchor" href="#范例-12"><span>范例</span></a></h3><p>我有一个很简单的 Person 类。</p><p><strong>class Person...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get name() {return this._name;}</span></span>
<span class="line"><span>set name(arg) {this._name = arg;}</span></span>
<span class="line"><span>get id() {return this._id;}</span></span>
<span class="line"><span>set id(arg) {this._id = arg;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>目前我会这样创建新对象：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const martin = new Person();</span></span>
<span class="line"><span>martin.name = &quot;martin&quot;;</span></span>
<span class="line"><span>martin.id = &quot;1234&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对象创建之后，name 字段可能会改变，但 id 字段不会。为了更清晰地表达这个设计意图，我希望移除对应 id 字段的设值函数。</p><p>但 id 字段还得设置初始值，所以我首先用改变函数声明（124）在构造函数中添加对应的参数。</p><p><strong>class Person...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor(id) {</span></span>
<span class="line"><span>  this.id = id;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后调整创建脚本，改为从构造函数设值 id 字段值。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const martin = new Person(&quot;1234&quot;);</span></span>
<span class="line"><span>martin.name = &quot;martin&quot;;</span></span>
<span class="line"><span>martin.id = &quot;1234&quot;;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所有创建 Person 对象的地方都要如此修改，每次修改之后要执行测试。</p><p>全部修改完成后，就可以用内联函数（115）消去设值函数。</p><p><strong>class Person...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor(id) {</span></span>
<span class="line"><span>  this._id = id;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>get name() {return this._name;}</span></span>
<span class="line"><span>set name(arg) {this._name = arg;}</span></span>
<span class="line"><span>get id() {return this._id;}</span></span>
<span class="line"><span>set id(arg) {this._id = arg;}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-8-以工厂函数取代构造函数-replace-constructor-with-factory-function" tabindex="-1"><a class="header-anchor" href="#_11-8-以工厂函数取代构造函数-replace-constructor-with-factory-function"><span>11.8 以工厂函数取代构造函数（Replace Constructor with Factory Function）</span></a></h2><p>曾用名：以工厂函数取代构造函数（Replace Constructor with Factory Method）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>leadEngineer = new Employee(document.leadEngineer, &quot;E&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>leadEngineer = createEngineer(document.leadEngineer);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-13" tabindex="-1"><a class="header-anchor" href="#动机-13"><span>动机</span></a></h3><p>很多面向对象语言都有特别的构造函数，专门用于对象的初始化。需要新建一个对象时，客户端通常会调用构造函数。但与一般的函数相比，构造函数又常有一些丑陋的局限性。例如，Java 的构造函数只能返回当前所调用类的实例，也就是说，我无法根据环境或参数信息返回子类实例或代理对象；构造函数的名字是固定的，因此无法使用比默认名字更清晰的函数名；构造函数需要通过特殊的操作符来调用（在很多语言中是 new 关键字），所以在要求普通函数的场合就难以使用。</p><p>工厂函数就不受这些限制。工厂函数的实现内部可以调用构造函数，但也可以换成别的方式实现。</p><h3 id="做法-13" tabindex="-1"><a class="header-anchor" href="#做法-13"><span>做法</span></a></h3><p>新建一个工厂函数，让它调用现有的构造函数。</p><p>将调用构造函数的代码改为调用工厂函数。</p><p>每修改一处，就执行测试。</p><p>尽量缩小构造函数的可见范围。</p><h3 id="范例-13" tabindex="-1"><a class="header-anchor" href="#范例-13"><span>范例</span></a></h3><p>又是那个单调乏味的例子：员工薪资系统。我还是以 Employee 类表示“员工”。</p><p><strong>class Employee...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor (name, typeCode) {</span></span>
<span class="line"><span>  this._name = name;</span></span>
<span class="line"><span>  this._typeCode = typeCode;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>get name() {return this._name;}</span></span>
<span class="line"><span>get type() {</span></span>
<span class="line"><span>  return Employee.legalTypeCodes[this._typeCode];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static get legalTypeCodes() {</span></span>
<span class="line"><span>  return {&quot;E&quot;: &quot;Engineer&quot;, &quot;M&quot;: &quot;Manager&quot;, &quot;S&quot;: &quot;Salesman&quot;};</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用它的代码有这样的：</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>candidate = new Employee(document.name, document.empType);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>也有这样的：</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const leadEngineer = new Employee(document.leadEngineer, &quot;E&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>重构的第一步是创建工厂函数，其中把对象创建的责任直接委派给构造函数。</p><p><strong>顶层作用域...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function createEmployee(name, typeCode) {</span></span>
<span class="line"><span>  return new Employee(name, typeCode);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后找到构造函数的调用者，并逐一修改它们，令其使用工厂函数。</p><p>第一处的修改很简单。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>candidate = createEmployee(document.name, document.empType);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>第二处则可以这样使用工厂函数。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const leadEngineer = createEmployee(document.leadEngineer, &quot;E&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>但我不喜欢这里的类型码——以字符串字面量的形式传入类型码，一般来说都是坏味道。所以我更愿意再新建一个工厂函数，把“员工类别”的信息嵌在函数名里体现。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>const leadEngineer = createEngineer(document.leadEngineer);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>顶层作用域...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function createEngineer(name) {</span></span>
<span class="line"><span>  return new Employee(name, &quot;E&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-9-以命令取代函数-replace-function-with-command" tabindex="-1"><a class="header-anchor" href="#_11-9-以命令取代函数-replace-function-with-command"><span>11.9 以命令取代函数（Replace Function with Command）</span></a></h2><p>曾用名：以函数对象取代函数（Replace Method with Method Object）</p><p>反向重构：以函数取代命令（344）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function score(candidate, medicalExam, scoringGuide) {</span></span>
<span class="line"><span>  let result = 0;</span></span>
<span class="line"><span>  let healthLevel = 0;</span></span>
<span class="line"><span>  // long body code</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Scorer {</span></span>
<span class="line"><span>  constructor(candidate, medicalExam, scoringGuide) {</span></span>
<span class="line"><span>    this._candidate = candidate;</span></span>
<span class="line"><span>    this._medicalExam = medicalExam;</span></span>
<span class="line"><span>    this._scoringGuide = scoringGuide;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  execute() {</span></span>
<span class="line"><span>    this._result = 0;</span></span>
<span class="line"><span>    this._healthLevel = 0;</span></span>
<span class="line"><span>    // long body code</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-14" tabindex="-1"><a class="header-anchor" href="#动机-14"><span>动机</span></a></h3><p>函数，不管是独立函数，还是以方法（method）形式附着在对象上的函数，是程序设计的基本构造块。不过，将函数封装成自己的对象，有时也是一种有用的办法。这样的对象我称之为“命令对象”（command object），或者简称“命令”（command）。这种对象大多只服务于单一函数，获得对该函数的请求，执行该函数，就是这种对象存在的意义。</p><p>与普通的函数相比，命令对象提供了更大的控制灵活性和更强的表达能力。除了函数调用本身，命令对象还可以支持附加的操作，例如撤销操作。我可以通过命令对象提供的方法来设值命令的参数值，从而支持更丰富的生命周期管理能力。我可以借助继承和钩子对函数行为加以定制。如果我所使用的编程语言支持对象但不支持函数作为一等公民，通过命令对象就可以给函数提供大部分相当于一等公民的能力。同样，即便编程语言本身并不支持嵌套函数，我也可以借助命令对象的方法和字段把复杂的函数拆解开，而且在测试和调试过程中可以直接调用这些方法。</p><p>所有这些都是使用命令对象的好理由，所以我要做好准备，一旦有需要，就能把函数重构成命令。不过我们不能忘记，命令对象的灵活性也是以复杂性作为代价的。所以，如果要在作为一等公民的函数和命令对象之间做个选择，95%的时候我都会选函数。只有当我特别需要命令对象提供的某种能力而普通的函数无法提供这种能力时，我才会考虑使用命令对象。</p><p>跟软件开发中的很多词汇一样，“命令”这个词承载了太多含义。在这里，“命令”是指一个对象，其中封装了一个函数调用请求。这是遵循《设计模式》[gof]一书中的命令模式（command pattern）。在这个意义上，使用“命令”一词时，我会先用完整的“命令对象”一词设定上下文，然后视情况使用简略的“命令”一词。在命令与查询分离原则（command-query separation principle）中也用到了“命令”一词，此时“命令”是一个对象所拥有的函数，调用该函数可以改变对象可观察的状态。我尽量避免使用这个意义上的“命令”一词，而更愿意称其为“修改函数”（modifier）或者“改变函数”（mutator）。</p><h3 id="做法-14" tabindex="-1"><a class="header-anchor" href="#做法-14"><span>做法</span></a></h3><p>为想要包装的函数创建一个空的类，根据该函数的名字为其命名。</p><p>使用搬移函数（198）把函数移到空的类里。</p><p>保持原来的函数作为转发函数，至少保留到重构结束之前才删除。</p><p>遵循编程语言的命名规范来给命令对象起名。如果没有合适的命名规范，就给命令对象中负责实际执行命令的函数起一个通用的名字，例如“execute”或者“call”。</p><p>可以考虑给每个参数创建一个字段，并在构造函数中添加对应的参数。</p><h3 id="范例-14" tabindex="-1"><a class="header-anchor" href="#范例-14"><span>范例</span></a></h3><p>JavaScript 语言有很多缺点，但把函数作为一等公民对待，是它最正确的设计决策之一。在不具备这种能力的编程语言中，我经常要费力为很常见的任务创建命令对象，JavaScript 则省去了这些麻烦。不过，即便在 JavaScript 中，有时也需要用到命令对象。</p><p>一个典型的应用场景就是拆解复杂的函数，以便我理解和修改。要想真正展示这个重构手法的价值，我需要一个长而复杂的函数，但这写起来太费事，你读起来也麻烦。所以我在这里展示的函数其实很短，并不真的需要本重构手法，还望读者权且包涵。下面的函数用于给一份保险申请评分。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function score(candidate, medicalExam, scoringGuide) {</span></span>
<span class="line"><span>  let result = 0;</span></span>
<span class="line"><span>  let healthLevel = 0;</span></span>
<span class="line"><span>  let highMedicalRiskFlag = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  if (medicalExam.isSmoker) {</span></span>
<span class="line"><span>    healthLevel += 10;</span></span>
<span class="line"><span>    highMedicalRiskFlag = true;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  let certificationGrade = &quot;regular&quot;;</span></span>
<span class="line"><span>  if (scoringGuide.stateWithLowCertification(candidate.originState)) {</span></span>
<span class="line"><span>    certificationGrade = &quot;low&quot;;</span></span>
<span class="line"><span>    result -= 5;</span></span>
<span class="line"><span>  } // lots more code like this</span></span>
<span class="line"><span>  result -= Math.max(healthLevel - 5, 0);</span></span>
<span class="line"><span>  return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我首先创建一个空的类，用搬移函数（198）把上述函数搬到这个类里去。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function score(candidate, medicalExam, scoringGuide) {</span></span>
<span class="line"><span>  return new Scorer().execute(candidate, medicalExam, scoringGuide);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class Scorer {</span></span>
<span class="line"><span>  execute(candidate, medicalExam, scoringGuide) {</span></span>
<span class="line"><span>    let result = 0;</span></span>
<span class="line"><span>    let healthLevel = 0;</span></span>
<span class="line"><span>    let highMedicalRiskFlag = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (medicalExam.isSmoker) {</span></span>
<span class="line"><span>      healthLevel += 10;</span></span>
<span class="line"><span>      highMedicalRiskFlag = true;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    let certificationGrade = &quot;regular&quot;;</span></span>
<span class="line"><span>    if (scoringGuide.stateWithLowCertification(candidate.originState)) {</span></span>
<span class="line"><span>      certificationGrade = &quot;low&quot;;</span></span>
<span class="line"><span>      result -= 5;</span></span>
<span class="line"><span>    } // lots more code like this</span></span>
<span class="line"><span>    result -= Math.max(healthLevel - 5, 0);</span></span>
<span class="line"><span>    return result;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大多数时候，我更愿意在命令对象的构造函数中传入参数，而不让 execute 函数接收参数。在这样一个简单的拆解场景中，这一点带来的影响不大；但如果我要处理的命令需要更复杂的参数设置周期或者大量定制，上述做法就会带来很多便利：多个命令类可以分别从各自的构造函数中获得各自不同的参数，然后又可以排成队列挨个执行，因为它们的 execute 函数签名都一样。</p><p>我可以每次搬移一个参数到构造函数。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function score(candidate, medicalExam, scoringGuide) {</span></span>
<span class="line"><span>  return new Scorer(candidate).execute(candidate, medicalExam, scoringGuide);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class Scorer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor(candidate){</span></span>
<span class="line"><span> this._candidate = candidate;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>execute (candidate, medicalExam, scoringGuide) {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> let healthLevel = 0;</span></span>
<span class="line"><span> let highMedicalRiskFlag = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if (medicalExam.isSmoker) {</span></span>
<span class="line"><span>  healthLevel += 10;</span></span>
<span class="line"><span>  highMedicalRiskFlag = true;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> let certificationGrade = &quot;regular&quot;;</span></span>
<span class="line"><span> if (scoringGuide.stateWithLowCertification(this._candidate.originState)) {</span></span>
<span class="line"><span>  certificationGrade = &quot;low&quot;;</span></span>
<span class="line"><span>  result -= 5;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // lots more code like this</span></span>
<span class="line"><span> result -= Math.max(healthLevel - 5, 0);</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>继续处理其他参数：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function score(candidate, medicalExam, scoringGuide) {</span></span>
<span class="line"><span>  return new Scorer(candidate, medicalExam, scoringGuide).execute();</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>class Scorer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor(candidate, medicalExam, scoringGuide){</span></span>
<span class="line"><span> this._candidate = candidate;</span></span>
<span class="line"><span> this._medicalExam = medicalExam;</span></span>
<span class="line"><span> this._scoringGuide = scoringGuide;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>execute () {</span></span>
<span class="line"><span> let result = 0;</span></span>
<span class="line"><span> let healthLevel = 0;</span></span>
<span class="line"><span> let highMedicalRiskFlag = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if (this._medicalExam.isSmoker) {</span></span>
<span class="line"><span>  healthLevel += 10;</span></span>
<span class="line"><span>  highMedicalRiskFlag = true;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> let certificationGrade = &quot;regular&quot;;</span></span>
<span class="line"><span> if (this._scoringGuide.stateWithLowCertification(this._candidate.originState)) {</span></span>
<span class="line"><span>  certificationGrade = &quot;low&quot;;</span></span>
<span class="line"><span>  result -= 5;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // lots more code like this</span></span>
<span class="line"><span> result -= Math.max(healthLevel - 5, 0);</span></span>
<span class="line"><span> return result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以命令取代函数的重构到此就结束了，不过之所以要做这个重构，是为了拆解复杂的函数，所以我还是大致展示一下如何拆解。下一步是把所有局部变量都变成字段，我还是每次修改一处。</p><p><strong>class Scorer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor(candidate, medicalExam, scoringGuide){</span></span>
<span class="line"><span> this._candidate = candidate;</span></span>
<span class="line"><span> this._medicalExam = medicalExam;</span></span>
<span class="line"><span> this._scoringGuide = scoringGuide;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>execute () {</span></span>
<span class="line"><span> this._result = 0;</span></span>
<span class="line"><span> let healthLevel = 0;</span></span>
<span class="line"><span> let highMedicalRiskFlag = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if (this._medicalExam.isSmoker) {</span></span>
<span class="line"><span>  healthLevel += 10;</span></span>
<span class="line"><span>  highMedicalRiskFlag = true;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> let certificationGrade = &quot;regular&quot;;</span></span>
<span class="line"><span> if (this._scoringGuide.stateWithLowCertification(this._candidate.originState)) {</span></span>
<span class="line"><span>  certificationGrade = &quot;low&quot;;</span></span>
<span class="line"><span>  this._result -= 5;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // lots more code like this</span></span>
<span class="line"><span> this._result -= Math.max(healthLevel - 5, 0);</span></span>
<span class="line"><span> return this._result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>重复上述过程，直到所有局部变量都变成字段。（“把局部变量变成字段”这个重构手法是如此简单，以至于我都没有在重构名录中给它一席之地。对此我略感愧疚。）</p><p><strong>class Scorer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor(candidate, medicalExam, scoringGuide){</span></span>
<span class="line"><span> this._candidate = candidate;</span></span>
<span class="line"><span> this._medicalExam = medicalExam;</span></span>
<span class="line"><span> this._scoringGuide = scoringGuide;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>execute () {</span></span>
<span class="line"><span> this._result = 0;</span></span>
<span class="line"><span> this._healthLevel = 0;</span></span>
<span class="line"><span> this._highMedicalRiskFlag = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> if (this._medicalExam.isSmoker) {</span></span>
<span class="line"><span>  this._healthLevel += 10;</span></span>
<span class="line"><span>  this._highMedicalRiskFlag = true;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> this._certificationGrade = &quot;regular&quot;;</span></span>
<span class="line"><span> if (this._scoringGuide.stateWithLowCertification(this._candidate.originState)) {</span></span>
<span class="line"><span>  this._certificationGrade = &quot;low&quot;;</span></span>
<span class="line"><span>  this._result -= 5;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // lots more code like this</span></span>
<span class="line"><span> this._result -= Math.max(this._healthLevel - 5, 0);</span></span>
<span class="line"><span> return this._result;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在函数的所有状态都已经移到了命令对象中，我可以放心使用提炼函数（106）等重构手法，而不用纠结于局部变量的作用域之类问题。</p><p><strong>class Scorer...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>execute () {</span></span>
<span class="line"><span> this._result = 0;</span></span>
<span class="line"><span> this._healthLevel = 0;</span></span>
<span class="line"><span> this._highMedicalRiskFlag = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span> this.scoreSmoking();</span></span>
<span class="line"><span> this._certificationGrade = &quot;regular&quot;;</span></span>
<span class="line"><span> if (this._scoringGuide.stateWithLowCertification(this._candidate.originState)) {</span></span>
<span class="line"><span>  this._certificationGrade = &quot;low&quot;;</span></span>
<span class="line"><span>  this._result -= 5;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> // lots more code like this</span></span>
<span class="line"><span> this._result -= Math.max(this._healthLevel - 5, 0);</span></span>
<span class="line"><span> return this._result;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>scoreSmoking() {</span></span>
<span class="line"><span> if (this._medicalExam.isSmoker) {</span></span>
<span class="line"><span>  this._healthLevel += 10;</span></span>
<span class="line"><span>  this._highMedicalRiskFlag = true;</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样我就可以像处理嵌套函数一样处理命令对象。实际上，在 JavaScript 中运用此重构手法时，的确可以考虑用嵌套函数来代替命令对象。不过我还是会使用命令对象，不仅因为我对命令对象更熟悉，而且还因为我可以针对命令对象中任何一个函数进行测试和调试。</p><h2 id="_11-10-以函数取代命令-replace-command-with-function" tabindex="-1"><a class="header-anchor" href="#_11-10-以函数取代命令-replace-command-with-function"><span>11.10 以函数取代命令（Replace Command with Function）</span></a></h2><p>反向重构：以命令取代函数（337）</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>class ChargeCalculator {</span></span>
<span class="line"><span>  constructor(customer, usage) {</span></span>
<span class="line"><span>    this._customer = customer;</span></span>
<span class="line"><span>    this._usage = usage;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  execute() {</span></span>
<span class="line"><span>    return this._customer.rate * this._usage;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>function charge(customer, usage) {</span></span>
<span class="line"><span>  return customer.rate * usage;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="动机-15" tabindex="-1"><a class="header-anchor" href="#动机-15"><span>动机</span></a></h3><p>命令对象为处理复杂计算提供了强大的机制。借助命令对象，可以轻松地将原本复杂的函数拆解为多个方法，彼此之间通过字段共享状态；拆解后的方法可以分别调用；开始调用之前的数据状态也可以逐步构建。但这种强大是有代价的。大多数时候，我只是想调用一个函数，让它完成自己的工作就好。如果这个函数不是太复杂，那么命令对象可能显得费而不惠，我就应该考虑将其变回普通的函数。</p><h3 id="做法-15" tabindex="-1"><a class="header-anchor" href="#做法-15"><span>做法</span></a></h3><p>运用提炼函数（106），把“创建并执行命令对象”的代码单独提炼到一个函数中。</p><p>这一步会新建一个函数，最终这个函数会取代现在的命令对象。</p><p>对命令对象在执行阶段用到的函数，逐一使用内联函数（115）。</p><p>如果被调用的函数有返回值，请先对调用处使用提炼变量（119），然后再使用内联函数（115）。</p><p>使用改变函数声明（124），把构造函数的参数转移到执行函数。</p><p>对于所有的字段，在执行函数中找到引用它们的地方，并改为使用参数。每次修改后都要测试。</p><p>把“调用构造函数”和“调用执行函数”两步都内联到调用方（也就是最终要替换命令对象的那个函数）。</p><p>测试。</p><p>用移除死代码（237）把命令类消去。</p><h3 id="范例-15" tabindex="-1"><a class="header-anchor" href="#范例-15"><span>范例</span></a></h3><p>假设我有一个很小的命令对象。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>class ChargeCalculator {</span></span>
<span class="line"><span>  constructor(customer, usage, provider) {</span></span>
<span class="line"><span>    this._customer = customer;</span></span>
<span class="line"><span>    this._usage = usage;</span></span>
<span class="line"><span>    this._provider = provider;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  get baseCharge() {</span></span>
<span class="line"><span>    return this._customer.baseRate * this._usage;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  get charge() {</span></span>
<span class="line"><span>    return this.baseCharge + this._provider.connectionCharge;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用方的代码如下。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>monthCharge = new ChargeCalculator(customer, usage, provider).charge;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>命令类足够小、足够简单，变成函数更合适。</p><p>首先，我用提炼函数（106）把命令对象的创建与调用过程包装到一个函数中。</p><p><strong>调用方...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>monthCharge = charge(customer, usage, provider);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>顶层作用域...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function charge(customer, usage, provider) {</span></span>
<span class="line"><span>  return new ChargeCalculator(customer, usage, provider).charge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来要考虑如何处理支持函数（也就是这里的 baseCharge 函数）。对于有返回值的函数，我一般会先用提炼变量（119）把返回值提炼出来。</p><p><strong>class ChargeCalculator...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get baseCharge() {</span></span>
<span class="line"><span>  return this._customer.baseRate * this._usage;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>get charge() {</span></span>
<span class="line"><span>  const baseCharge = this.baseCharge;</span></span>
<span class="line"><span>  return baseCharge + this._provider.connectionCharge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后对支持函数使用内联函数（115）。</p><p><strong>class ChargeCalculator...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>get charge() {</span></span>
<span class="line"><span>  const baseCharge = this._customer.baseRate * this._usage;</span></span>
<span class="line"><span>  return baseCharge + this._provider.connectionCharge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在所有逻辑处理都集中到一个函数了，下一步是把构造函数传入的数据移到主函数。首先用改变函数声明（124）把构造函数的参数逐一添加到 charge 函数上。</p><p><strong>class ChargeCalculator...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor (customer, usage, provider){</span></span>
<span class="line"><span> this._customer = customer;</span></span>
<span class="line"><span> this._usage = usage;</span></span>
<span class="line"><span> this._provider = provider;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>charge(customer, usage, provider) {</span></span>
<span class="line"><span> const baseCharge = this._customer.baseRate * this._usage;</span></span>
<span class="line"><span> return baseCharge + this._provider.connectionCharge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>顶层作用域...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function charge(customer, usage, provider) {</span></span>
<span class="line"><span>  return new ChargeCalculator(customer, usage, provider).charge(</span></span>
<span class="line"><span>    customer,</span></span>
<span class="line"><span>    usage,</span></span>
<span class="line"><span>    provider</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后修改 charge 函数的实现，改为使用传入的参数。这个修改可以小步进行，每次使用一个参数。</p><p><strong>class ChargeCalculator...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>constructor (customer, usage, provider){</span></span>
<span class="line"><span> this._customer = customer;</span></span>
<span class="line"><span> this._usage = usage;</span></span>
<span class="line"><span> this._provider = provider;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>charge(customer, usage, provider) {</span></span>
<span class="line"><span> const baseCharge = customer.baseRate * this._usage;</span></span>
<span class="line"><span> return baseCharge + this._provider.connectionCharge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>构造函数中对\xA0<code>this._customer</code>\xA0字段的赋值不删除也没关系，因为反正没人使用这个字段。但我更愿意去掉这条赋值语句，因为去掉它以后，如果在函数实现中漏掉了一处对字段的使用没有修改，测试就会失败。（如果我真的犯了这个错误而测试没有失败，我就应该考虑增加测试了。）</p><p>其他参数也如法炮制，直到 charge 函数不再使用任何字段：</p><p><strong>class ChargeCalculator...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>charge(customer, usage, provider) {</span></span>
<span class="line"><span>  const baseCharge = customer.baseRate * usage;</span></span>
<span class="line"><span>  return baseCharge + provider.connectionCharge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我就可以把所有逻辑都内联到顶层的 charge 函数中。这是内联函数（115）的一种特殊情况，我需要把构造函数和执行函数一并内联。</p><p><strong>顶层作用域...</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee;--shiki-light-bg:#ffffff;--shiki-dark-bg:#121212;"><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code class="language-"><span class="line"><span>function charge(customer, usage, provider) {</span></span>
<span class="line"><span>  const baseCharge = customer.baseRate * usage;</span></span>
<span class="line"><span>  return baseCharge + provider.connectionCharge;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在命令类已经是死代码了，可以用移除死代码（237）给它一个体面的葬礼。</p>`,820)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};