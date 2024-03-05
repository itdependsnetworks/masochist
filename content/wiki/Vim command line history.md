---
tags: vim wiki
title: Vim command line history
---

# See recent command history

    :hist -30,-1

# See recent search history

    :hist / -30,-1

# Enter command window

    q:

From in here, you can:

-   edit previous commands
-   hit `<CR>` to run a command
-   hit `<C-c>` to close the command window
-   yank commands, then:
    -   `:@"<CR>` to run them; or
    -   write them to a file and source it (eg. with `:source <file>`)

# Registers

-   `":` holds last command (paste it with `":p`, run it with `@:`)
-   `"/` holds last search (paste it with `"/p`)

# Example use case

In updating to [Rails](/wiki/Rails) 4 I found my custom routing matcher was broken, and that the one provided with [RSpec](/wiki/RSpec) had come up to feature parity. Getting everything ported would require editing hundreds of lines of files.

I edited one file manual, trying out each of the different substitutions I would need to do. Then I pulled up the command window (`q:`) and extracted the commands into a file which I could then `:source`:

    %s/@//gce
    %s/\v\{ (.+).should \=\= (['"].+['"]) \}/{ expect(\1).to eq(\2) }/gce
    %s/\v(:)@<!:([a-zA-Z_][a-zA-Z_0-9]*)(\s*)\=\>\s?/\2:\3/gce
    %s/should_not be_recognized/to_not be_routable/gce
    %s/\v(put|get|delete|post)\(/expect(\1: /gce
    %s/\vshould (have_routing|map_to)/to route_to/gce

This drops some unnecessary instance variables (which I manually replace with `let` declarations), switches from the deprecated `should` to the "new" (circa 2012) `expect` syntax, changes Ruby 1.8 Hash syntax to 1.9+ syntax, and swaps out my custom matcher for the equivalent calls to the built in RSpec matchers.

With this, I was able to edit each routing spec file (on average 50-100 lines each) in about 10 seconds per file, which made a potentially very tedious task a breeze. Here's a diff for one of the files to give a sense of what was involved:

```diff
diff --git a/spec/routing/posts_routing_spec.rb b/spec/routing/posts_routing_spec.rb
index 1882cf6..8b78443 100644
--- a/spec/routing/posts_routing_spec.rb
+++ b/spec/routing/posts_routing_spec.rb
@@ -2,72 +2,72 @@ require 'spec_helper'

 describe PostsController do
   describe 'routing' do
-    specify { get('/blog').should have_routing('posts#index') }
-    specify { get('/blog/new').should have_routing('posts#new') }
-    specify { get('/blog/synergy-5.0-released').should have_routing('posts#show', :id => 'synergy-5.0-released') }
-    specify { get('/blog/synergy-5.0-released/edit').should have_routing('posts#edit', :id => 'synergy-5.0-released') }
-    specify { put('/blog/synergy-5.0-released').should have_routing('posts#update', :id => 'synergy-5.0-released') }
-    specify { delete('/blog/synergy-5.0-released').should have_routing('posts#destroy', :id => 'synergy-5.0-released') }
-    specify { post('/blog').should have_routing('posts#create') }
+    specify { expect(get: '/blog').to route_to('posts#index') }
+    specify { expect(get: '/blog/new').to route_to('posts#new') }
+    specify { expect(get: '/blog/synergy-5.0-released').to route_to('posts#show', id: 'synergy-5.0-released') }
+    specify { expect(get: '/blog/synergy-5.0-released/edit').to route_to('posts#edit', id: 'synergy-5.0-released') }
+    specify { expect(put: '/blog/synergy-5.0-released').to route_to('posts#update', id: 'synergy-5.0-released') }
+    specify { expect(delete: '/blog/synergy-5.0-released').to route_to('posts#destroy', id: 'synergy-5.0-released') }
+    specify { expect(post: '/blog').to route_to('posts#create') }

     describe 'index pagination' do
-      specify { get('/blog/page/2').should map_to('posts#index', :page => '2') }
+      specify { expect(get: '/blog/page/2').to route_to('posts#index', page: '2') }

       # note how we can still have an post titled "Page"
-      specify { get('/blog/page').should have_routing('posts#show', :id => 'page') }
+      specify { expect(get: '/blog/page').to route_to('posts#show', id: 'page') }

       it 'rejects non-numeric :page params' do
-        get('/blog/page/foo').should_not be_recognized
+        expect(get: '/blog/page/foo').to_not be_routable
       end
     end

     describe 'comments' do
       # only [/tags/new #new], [/tags/create #create] and [/tags/update #update] are implemented while nested
-      specify { get('/blog/synergy-5.0-released/comments/new').should have_routing('comments#new', :post_id => 'synergy-5.0-released') }
-      specify { post('/blog/synergy-5.0-released/comments').should have_routing('comments#create', :post_id => 'synergy-5.0-released') }
-      specify { put('/blog/synergy-5.0-released/comments/123').should have_routing('comments#update', :post_id => 'synergy-5.0-released', :id => '123') }
+      specify { expect(get: '/blog/synergy-5.0-released/comments/new').to route_to('comments#new', post_id: 'synergy-5.0-released') }
+      specify { expect(post: '/blog/synergy-5.0-released/comments').to route_to('comments#create', post_id: 'synergy-5.0-released') }
+      specify { expect(put: '/blog/synergy-5.0-released/comments/123').to route_to('comments#update', post_id: 'synergy-5.0-released', id: '123') }

       # all other RESTful actions are no-ops
-      specify { get('/blog/synergy-5.0-released/comments').should_not be_recognized }
-      specify { get('/blog/synergy-5.0-released/comments/456').should_not be_recognized }
-      specify { get('/blog/synergy-5.0-released/comments/456/edit').should_not be_recognized }
-      specify { delete('/blog/synergy-5.0-released/comments/456').should_not be_recognized }
+      specify { expect(get: '/blog/synergy-5.0-released/comments').to_not be_routable }
+      specify { expect(get: '/blog/synergy-5.0-released/comments/456').to_not be_routable }
+      specify { expect(get: '/blog/synergy-5.0-released/comments/456/edit').to_not be_routable }
+      specify { expect(delete: '/blog/synergy-5.0-released/comments/456').to_not be_routable }
     end

     describe 'regressions' do
       it 'handles trailing slashes on resources declared using ":as"' do
         # bug appeared in Rails 2.3.0 RC1; see:
         #   http://rails.lighthouseapp.com/projects/8994/tickets/2039
-        get('/blog/').should map_to('posts#index')
+        expect(get: '/blog/').to route_to('posts#index')
       end

       it 'handles comment creation on posts with periods in the title' do
         # see: https://typechecked.net/issues/1410
-        post('/blog/foo.bar/comments').should map_to('comments#create', :post_id => 'foo.bar')
+        expect(post: '/blog/foo.bar/comments').to route_to('comments#create', post_id: 'foo.bar')
       end
     end

     describe 'helpers' do
-      before do
+      let(:post) do
         # we use an post with a "tricky" id (containing a period, which is
         # usually a format separator) to test the routes
-        @post = Post.stub :permalink => 'synergy-5.0-released'
+        Post.stub permalink: 'synergy-5.0-released'
       end

       describe 'posts_path' do
-        specify { posts_path.should == '/blog' }
+        specify { expect(posts_path).to eq('/blog') }
       end

       describe 'new_post_path' do
-        specify { new_post_path.should == '/blog/new' }
+        specify { expect(new_post_path).to eq('/blog/new') }
       end

       describe 'post_path' do
-        specify { post_path(@post).should == '/blog/synergy-5.0-released' }
+        specify { expect(post_path(post)).to eq('/blog/synergy-5.0-released') }
       end

       describe 'edit_post_path' do
-        specify { edit_post_path(@post).should == '/blog/synergy-5.0-released/edit' }
+        specify { expect(edit_post_path(post)).to eq('/blog/synergy-5.0-released/edit') }
       end
     end
   end
```
