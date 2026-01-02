'use client';

import { useState } from 'react';

interface DraggableItem {
  id: number;
  content: string;
  color: string;
}

export default function DraggablePage() {
  const [items] = useState<DraggableItem[]>([
    { id: 1, content: '组件 A', color: 'bg-blue-500' },
    { id: 2, content: '组件 B', color: 'bg-green-500' },
    { id: 3, content: '组件 C', color: 'bg-purple-500' },
    { id: 4, content: '组件 D', color: 'bg-orange-500' },
    { id: 5, content: '组件 E', color: 'bg-pink-500' },
  ]);

  const [droppedItems, setDroppedItems] = useState<DraggableItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null);

  const handleDragStart = (item: DraggableItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    if (draggedItem) {
      setDroppedItems([...droppedItems, draggedItem]);
      setDraggedItem(null);
    }
  };

  const handleRemoveItem = (id: number) => {
    setDroppedItems(droppedItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          可拖拽式组件放置演示
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 可拖拽组件区域 */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">可拖拽组件</h2>
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  className={`${item.color} flex h-24 cursor-move items-center justify-center rounded-lg text-lg font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95`}
                >
                  {item.content}
                </div>
              ))}
            </div>
          </div>

          {/* 放置区域 */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`min-h-[400px] rounded-xl border-2 border-dashed p-6 shadow-lg transition-colors ${
              draggedItem
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              放置区域
              {droppedItems.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({droppedItems.length} 个组件)
                </span>
              )}
            </h2>
            
            {droppedItems.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-gray-400">
                <p>将组件拖拽到这里</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {droppedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`${item.color} relative flex h-24 items-center justify-center rounded-lg text-lg font-semibold text-white shadow-md transition-transform hover:scale-105`}
                  >
                    {item.content}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40"
                      aria-label="移除组件"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 说明区域 */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">使用说明</h3>
          <ul className="ml-5 list-disc space-y-2 text-gray-600">
            <li>点击并拖拽左侧的可拖拽组件</li>
            <li>将组件拖到右侧的放置区域释放</li>
            <li>点击组件右上角的 × 按钮可以移除已放置的组件</li>
            <li>可以多次拖拽同一个组件到放置区域</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
