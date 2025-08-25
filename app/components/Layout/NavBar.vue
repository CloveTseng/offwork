<template>
  <nav class="rounded-full bg-neutral-1000 p-3">
    <ul class="grid grid-cols-4 gap-1 text-center text-xs font-medium">
      <!-- 首頁 -->
      <li>
        <NuxtLink
          to="/"
          class="flex flex-col items-center rounded-full py-1 transition hover:text-white"
          :class="
            $route.path === '/' || ''
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-500'
          "
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.375 19.733a1 1 0 0 1-1 1h-16a1 1 0 0 1-1-1V9.223a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79zm-10-7v6h2v-6z"
              fill="currentColor"
            />
          </svg>
          首頁
        </NuxtLink>
      </li>
      <!-- 心情（沒有頁面純裝飾） -->
      <li>
        <NuxtLink
          to="#"
          class="flex flex-col items-center rounded-full py-1 transition hover:text-white"
          :class="
            $route.path === '#'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-500'
          "
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.125 3h15a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v3a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4V4a1 1 0 0 1 1-1m13 2v3h2V5zm-16 14h18v2h-18z"
              fill="currentColor"
            />
          </svg>
          心情
        </NuxtLink>
      </li>
      <!-- 分析 -->
      <li>
        <NuxtLink
          to="/analyze"
          class="flex flex-col items-center rounded-full py-1 transition hover:text-white"
          :class="
            $route.path === '/analyze'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-500'
          "
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.875 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m4 10v4h2v-4zm4-6v10h2V7zm4 3v7h2v-7z"
              fill="currentColor"
            />
          </svg>
          分析
        </NuxtLink>
      </li>
      <!-- 我的 -->
      <li>
        <NuxtLink
          to="/my"
          class="flex flex-col items-center rounded-full py-1 transition hover:text-white"
          :class="
            $route.path === '/my'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-500'
          "
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.433 8.39a1 1 0 0 0-.961-.723H12.2a1 1 0 0 0-.928.627l-1.696 4.222a1 1 0 0 1-.928.627H6.674a1 1 0 0 0-.913.592l-3.508 7.857A1 1 0 0 0 3.166 23h19.132a1 1 0 0 0 .96-1.276zM13.725 1a1 1 0 0 1 1-1h.2a1 1 0 0 1 1 1v2.381a1 1 0 0 1-1 1h-.2a1 1 0 0 1-1-1zm4.145 4.602a1 1 0 0 1 0-1.417l1.694-1.687a1 1 0 0 1 1.411 0l.139.138a1 1 0 0 1 0 1.417L19.418 5.74a1 1 0 0 1-1.41 0zM8.54 4.05a1 1 0 0 1 0-1.417l.139-.138a1 1 0 0 1 1.411 0l1.694 1.688a1 1 0 0 1 0 1.417l-.139.137a1 1 0 0 1-1.41 0z"
              fill="currentColor"
            />
          </svg>
          我的
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
