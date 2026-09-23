import React, { useState } from 'react';
import {
  Leaf,
  Wind,
  Brain,
  Moon,
  Target,
  MessageCircle,
  Play,
  BookOpen,
  Headphones,
  Sparkles,
  Search,
  ArrowRight
} from 'lucide-react';
import type { View, ResourceItem, ResourceIntent, ResourceCategory } from '../types/wellbeing';
import { WELLNESS_RESOURCES } from '../data/resources';
import { BreathingModal } from '../components/resources/BreathingModal';
import { ArticleReaderModal } from '../components/resources/ArticleReaderModal';
import { AudioPlayerModal } from '../components/resources/AudioPlayerModal';

interface ResourcesPageProps {
  navigate: (view: View) => void;
}

const INTENT_OPTIONS: Array<{
  id: ResourceIntent;
  emoji: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'calm', emoji: '😮💨', label: 'Calm down', icon: Wind },
  { id: 'clear_mind', emoji: '🧠', label: 'Clear my mind', icon: Brain },
  { id: 'sleep', emoji: '😴', label: 'Wind down', icon: Moon },
  { id: 'focus', emoji: '🎯', label: 'Focus', icon: Target },
  { id: 'support', emoji: '💬', label: 'Talk to someone', icon: MessageCircle },
];

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ navigate }) => {
  const [selectedIntent, setSelectedIntent] = useState<ResourceIntent>('calm');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modals
  const [activeBreathing, setActiveBreathing] = useState<ResourceItem | null>(null);
  const [activeArticle, setActiveArticle] = useState<ResourceItem | null>(null);
  const [activeAudio, setActiveAudio] = useState<ResourceItem | null>(null);

  const handleOpenResource = (resource: ResourceItem) => {
    if (resource.id === 'qa_wellness_guide') {
      // Open default guide
      const guide = WELLNESS_RESOURCES.find(r => r.id === 'edu_academic_pressure') || resource;
      setActiveArticle(guide);
      return;
    }

    if (resource.type === 'breathing') {
      setActiveBreathing(resource);
    } else if (resource.type === 'article') {
      setActiveArticle(resource);
    } else if (resource.type === 'audio') {
      setActiveAudio(resource);
    }
  };

  // 2-3 Dynamic Recommended Items for "What do you need right now?"
  const recommendedItems = WELLNESS_RESOURCES.filter((r) =>
    r.intentTags.includes(selectedIntent)
  ).slice(0, 3);

  // Filtered resources for category list
  const filteredResources = WELLNESS_RESOURCES.filter((r) => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryResources = (cat: ResourceCategory) =>
    WELLNESS_RESOURCES.filter((r) => r.category === cat);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-[#6ec4b2] text-xs font-semibold uppercase tracking-wider">
          <Leaf className="w-4 h-4" />
          <span>🌿 Wellness Resources</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Small tools for when your mind needs a reset.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Explore short, optional activities for stress relief, focus, sleep, and everyday wellbeing. Choose what feels useful right now.
        </p>
      </div>

      {/* SECTION 1: "WHAT DO YOU NEED RIGHT NOW?" */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200 dark:border-emerald-800/50 space-y-6 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            What do you need right now?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Choose a starting point. There’s no right answer.
          </p>
        </div>

        {/* Intent Selectors */}
        <div className="flex flex-wrap gap-2.5">
          {INTENT_OPTIONS.map((intent) => {
            const isSelected = selectedIntent === intent.id;
            return (
              <button
                key={intent.id}
                onClick={() => setSelectedIntent(intent.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400'
                }`}
              >
                <span>{intent.emoji}</span>
                <span>{intent.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Recommended Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {recommendedItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-emerald-100 dark:border-emerald-900/40 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {item.duration || 'Short Tool'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium capitalize">
                    {item.type}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => handleOpenResource(item)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                {item.type === 'article' ? (
                  <>
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Start
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: SEARCH & CATEGORY FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex overflow-x-auto gap-1.5 pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Resources' },
            { id: 'breathing', label: 'Breathing' },
            { id: 'meditation', label: 'Mindfulness' },
            { id: 'education', label: 'Education' },
            { id: 'sounds', label: 'Music & Sounds' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Search Results Section */}
      {searchQuery !== '' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Search Results ({filteredResources.length})
          </h2>
          {filteredResources.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No resources found matching "{searchQuery}".
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredResources.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {item.badge || item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{item.duration}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenResource(item)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    {item.type === 'article' ? 'Read Guide' : 'Open Resource'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: QUICK ACTIONS */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {getCategoryResources('quick_action').map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {item.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenResource(item)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  {item.type === 'article' ? (
                    <>
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Start
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: BREATHING EXERCISES */}
      {(selectedCategory === 'all' || selectedCategory === 'breathing') && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wind className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Breathing Exercises
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getCategoryResources('breathing').map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {item.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenResource(item)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play Interactive Reset
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: MEDITATION & MINDFULNESS */}
      {(selectedCategory === 'all' || selectedCategory === 'meditation') && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Meditation & Mindfulness
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getCategoryResources('meditation').map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      {item.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenResource(item)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play Guided Mindfulness
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: EDUCATIONAL RESOURCES */}
      {(selectedCategory === 'all' || selectedCategory === 'education') && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Educational Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {getCategoryResources('education').map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {item.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenResource(item)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: MUSIC & SOUNDS */}
      {(selectedCategory === 'all' || selectedCategory === 'sounds') && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Music & Ambient Sounds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getCategoryResources('sounds').map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                      {item.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenResource(item)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Listen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: NEED MORE SUPPORT? CTA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold">Need more support?</h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Resources can help you take a small pause, but you don't have to handle everything alone. Connect with a college counsellor whenever you feel ready.
          </p>
        </div>

        <button
          onClick={() => navigate('counsellor')}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-emerald-800 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2"
        >
          Talk to a Counsellor <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modals */}
      <BreathingModal
        resource={activeBreathing}
        onClose={() => setActiveBreathing(null)}
      />

      <ArticleReaderModal
        resource={activeArticle}
        onClose={() => setActiveArticle(null)}
      />

      <AudioPlayerModal
        resource={activeAudio}
        onClose={() => setActiveAudio(null)}
      />
    </div>
  );
};
