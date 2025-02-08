document.addEventListener('DOMContentLoaded', () => {
  // Handle delete button clicks
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-post')) {
      const id = e.target.dataset.id;
      if (!confirm('Are you sure you want to delete this post?')) {
        return;
      }

      try {
        const response = await fetch(`/post/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete post');
        }

        // Remove the post from the DOM
        const postElement = e.target.closest('article');
        postElement.remove();

        // Check if there are any posts left
        const remainingPosts = document.querySelectorAll('article');
        if (remainingPosts.length === 0) {
          // If no posts left, reload the page to get fresh state
          window.location.reload();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete post. Please try again.');
      }
    }

    // Handle edit button clicks
    if (e.target.classList.contains('edit-post')) {
      const button = e.target;
      const article = button.closest('article');
      const postData = button.dataset;

      // Create edit form
      const originalContent = article.innerHTML;
      article.innerHTML = `
        <form class="edit-post-form">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-white">Title:</label>
              <input type="text" name="title" required value="${postData.title}" 
                class="mt-1 block w-full rounded-md bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-white">Content:</label>
              <textarea name="content" rows="6" required 
                class="mt-1 block w-full rounded-md bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500">${postData.content}</textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-white">Author:</label>
              <input type="text" name="author" required value="${postData.author}" 
                class="mt-1 block w-full rounded-md bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-white">Tags:</label>
              <input type="text" name="tags" value="${postData.tags}" 
                class="mt-1 block w-full rounded-md bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-2">
              <button type="submit" 
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Save
              </button>
              <button type="button" class="cancel-edit 
                inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </form>
      `;

      // Handle form submission
      const form = article.querySelector('.edit-post-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
          const formData = new FormData(form);
          const response = await fetch(`/post/${postData.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: formData.get('title'),
              content: formData.get('content'),
              author: formData.get('author'),
              tags: formData.get('tags'),
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update post');
          }

          const result = await response.json();
          window.location.reload(); // Reload to show updated post
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to update post. Please try again.');
        }
      });

      // Handle cancel button
      const cancelButton = article.querySelector('.cancel-edit');
      cancelButton.addEventListener('click', () => {
        article.innerHTML = originalContent;
      });
    }
  });
});
