---
title: Beware of flakey testing frameworks
tags: rspec rant cucumber blog
cache_breaker: 1
---

We write tests because we want our software to be robust. But it's hard to feel that your development infrastructure as a whole is solid when your testing frameworks keep breaking every time there's unusually high sunspot activity, or the wind blows from the north, or somebody looks at them.

# The test:benefit ratio

It's also frustrating to see the test:benefit ratio skewing further and further out of proportion.

Every test you write has a cost — the time taken to write it, and the time taken to maintain it and keep it working as the codebase evolves — and also, hopefully, a benefit: bug discovery, protection against regressions, increased developer confidence, and so on.

Before (and as) you write any given test you should be asking yourself, "Does the cost of writing and maintaining this test exceed the benefit I'm likely to receive as a result?" If the answer is "yes", then there are a number of possible conclusions; either you shouldn't be writing the test at all, you should be writing it in a different way, or there's a problem with the design of the software being tested that's driving the cost of the test up inappropriately.

So, it's quite frustrating when the very tools that you use to help you write tests start backfiring on you and adding to the cost side of the test:benefit equation.

# [RSpec](/wiki/RSpec) and [Cucumber](/wiki/Cucumber)

I've been getting more and more annoyed with these two fine pieces of software of late because they've been contributing far too often to the wrong side of the test:benefit equation.

On the off chance that any of the authors of or contributors to either of these projects happen to read this post, let me make it clear that I really appreciate their efforts and I think they are truly great, useful pieces of software.

My intention here is just to vent off a little bit and complain about how, of late, every time I see news of an [RSpec](/wiki/RSpec) or [Cucumber](/wiki/Cucumber) update, I grit my teeth and decide to do the usual `sudo gem install cucumber` or `sudo gem install rspec` and then sit back and watch how many previously working things go "boom".

The recent RSpec 1.2.3 release [was broken](https://rspec.lighthouseapp.com/projects/5645/tickets/788) due to a bad manifest file and 1.2.4 was very quickly released to address the error:

    /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `gem_original_require': no such file to load -- spec/expectations/fail_with (LoadError)
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `require'
    	from /Library/Ruby/Gems/1.8/gems/rspec-1.2.3/lib/spec/expectations.rb:2
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `gem_original_require'
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `require'
    	from /Library/Ruby/Gems/1.8/gems/rspec-1.2.3/lib/spec.rb:4
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `gem_original_require'
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `require'
    	from /Library/Ruby/Gems/1.8/gems/rspec-1.2.3/lib/spec/autorun.rb:1
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `gem_original_require'
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `require'
    	from /Library/Ruby/Gems/1.8/gems/rspec-1.2.3/bin/spec:3
    	from /usr/bin/spec:19:in `load'
    	from /usr/bin/spec:19

But 1.2.4 itself broke Cucumber:

    /Library/Ruby/Site/1.8/rubygems.rb:149:in `activate': can't activate rspec (= 1.2.2, runtime), already activated rspec-1.2.4 (Gem::Exception)
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:35:in `polyglot_original_require'
    	from /Library/Ruby/Gems/1.8/gems/polyglot-0.2.5/lib/polyglot.rb:54:in `require'
    	from /Users/wincent/trabajo/unversioned/wincent.dev/src/vendor/rails/activesupport/lib/active_support/dependencies.rb:158:in `require'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.2.3/bin/../lib/cucumber/cli/main.rb:92:in `enable_diffing'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.2.3/bin/../lib/cucumber/cli/main.rb:35:in `execute!'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.2.3/bin/../lib/cucumber/cli/main.rb:20:in `execute'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.2.3/bin/cucumber:6
    rake aborted!
    Command failed with status (1): [/System/Library/Frameworks/Ruby.framework/...]

    (See full trace by running task with --trace)

Cucumber 0.3.0 works around the breakage, but itself causes [more breakage](https://rspec.lighthouseapp.com/projects/16211/tickets/291):

    /Library/Ruby/Gems/1.8/gems/cucumber-0.3.0/bin/../lib/cucumber/step_mother.rb:189:in `World': You can only pass a proc to [/tags/World #World] once, but it's happening (Cucumber::MultipleWorld)
    in 2 places:

    mber/rails/world.rb:72:in `World'
    features/support/env.rb:32:in `World'

    Use Ruby modules instead to extend your worlds. See the [/tags/World #World] RDoc.

    	from ./features/support/env.rb:32
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `gem_original_require'
    	from /Library/Ruby/Site/1.8/rubygems/custom_require.rb:31:in `polyglot_original_require'
    	from /Library/Ruby/Gems/1.8/gems/polyglot-0.2.5/lib/polyglot.rb:54:in `require'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.3.0/bin/../lib/cucumber/cli/main.rb:79:in `require_files'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.3.0/bin/../lib/cucumber/cli/main.rb:77:in `each'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.3.0/bin/../lib/cucumber/cli/main.rb:77:in `require_files'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.3.0/bin/../lib/cucumber/cli/main.rb:34:in `execute!'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.3.0/bin/../lib/cucumber/cli/main.rb:20:in `execute'
    	from /Library/Ruby/Gems/1.8/gems/cucumber-0.3.0/bin/cucumber:6
    rake aborted!
    Command failed with status (1): [/System/Library/Frameworks/Ruby.framework/...]

    (See full trace by running task with --trace)

Of the two place listed, one of them is a non-existent path (`mber/rails/world.rb`) although it's fairly easy to deduce what it must be referring to.

The [API](/wiki/API) churn in Cucumber is annoying but somewhat understandable given that it is a pre-1.0 product. (What's less understandable is RSpec's decision to take out the existing post-1.0 story runner and replace it with an admittedly superior but still very much alpha external rewrite.)

So this kind of minor breakage with almost every single release is tiring. RSpec and Cucumber in general make testing quite pleasurable, if one can say such a thing, but this extra friction is a little bit exasperating. As [Rails](/wiki/Rails) users we must _already_ suffer enough churning APIs, reckless refactoring, and the resulting "busy work" that's required to file bug reports, prepare patches, and develop workarounds. It would be nice if at least our testing tools could be examples of relative stability and robustness.
