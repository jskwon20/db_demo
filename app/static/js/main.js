document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');
    const postsList = document.getElementById('postsList');
    const loadingElement = document.querySelector('.loading');

    // 게시글 목록 불러오기
    async function loadPosts() {
        try {
            showLoading();
            const response = await fetch(window.API_URL + '/posts/');
            if (!response.ok) {
                throw new Error('게시글을 불러오는 데 실패했습니다.');
            }
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('Error:', error);
            showError('게시글을 불러오는 중 오류가 발생했습니다.');
        } finally {
            hideLoading();
        }
    }

    // 게시글 목록 표시
    function displayPosts(posts) {
        if (!posts || posts.length === 0) {
            postsList.innerHTML = `
                <div class="text-center py-4 text-gray-500">
                    <p>등록된 게시글이 없습니다.</p>
                </div>
            `;
            return;
        }

        const postsHtml = posts.map(post => `
            <div class="post-item">
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <p class="post-content">${escapeHtml(post.content)}</p>
                <div class="post-meta">
                    <span>ID: ${post.id}</span>
                </div>
            </div>
        `).join('');

        postsList.innerHTML = postsHtml;
    }

    // 게시글 등록
    if (postForm) {
        postForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(postForm);
            const title = formData.get('title');
            const content = formData.get('content');

            if (!title.trim() || !content.trim()) {
                alert('제목과 내용을 모두 입력해주세요.');
                return;
            }

            try {
                showLoading();
                const response = await fetch(window.API_URL + '/posts/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: title,
                        content: content
                    })
                });

                if (!response.ok) {
                    throw new Error('게시글 등록에 실패했습니다.');
                }

                // 폼 초기화
                postForm.reset();
                
                // 게시글 목록 새로고침
                await loadPosts();
                
                // 성공 메시지 표시
                alert('게시글이 성공적으로 등록되었습니다.');
            } catch (error) {
                console.error('Error:', error);
                alert('게시글 등록 중 오류가 발생했습니다.');
            } finally {
                hideLoading();
            }
        });
    }

    // 로딩 상태 표시
    function showLoading() {
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
    }

    function hideLoading() {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    // 에러 메시지 표시
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorDiv.role = 'alert';
        errorDiv.innerHTML = `
            <strong class="font-bold">오류!</strong>
            <span class="block sm:inline">${message}</span>
            <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </span>
        `;
        
        // 에러 메시지가 이미 있으면 제거
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // 게시글 목록 위에 에러 메시지 추가
        if (postsList && postsList.parentNode) {
            postsList.parentNode.insertBefore(errorDiv, postsList);
        }
        
        // 5초 후 에러 메시지 자동 제거
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    // XSS 방지를 위한 HTML 이스케이프
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 초기 게시글 목록 로드
    loadPosts();
});
