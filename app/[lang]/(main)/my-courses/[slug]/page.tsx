'use client';

import { useCourseBySlug } from '@/utils/hooks/getCourse';
import React, { useEffect, useState } from 'react';
import { FaRegFaceSadTear } from 'react-icons/fa6';
import dynamic from 'next/dynamic';

// Dynamically import PlyrVideoComponent, disabling SSR
const PlyrVideo = dynamic(() => import('@/components/mediaPlayer/player'), {
  ssr: false,
});

function MyCourse({ params }: { params: { slug: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const slug = params.slug;
  const numericId = slug.split('-').pop();

  const { data: course, isLoading, isError } = useCourseBySlug(Number(numericId));
   
  const [selectedVideo, setSelectedVideo] = useState<string>('');

  useEffect(() => {
    if (course?.content && JSON.parse(course.content).units[0].lessons[0].videoUrl) {
      setSelectedVideo(JSON.parse(course.content).units[0].lessons[0].videoUrl);
    }
  }, [course?.content]);

  const handleLessonSelect = (videoUrl: string) => {
    console.log('Selected videoUrl:', videoUrl);
    setSelectedVideo(videoUrl);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className='flex justify-center items-center py-20 text-xl'>
        <FaRegFaceSadTear className='mx-5 h-11 w-11' /> Error loading course
      </div>
    );
  }

  if (!course && !isLoading && !isError) {
    return (
      <div className='flex justify-center items-center py-20 text-xl'>
        <FaRegFaceSadTear className='mx-5 h-11 w-11' /> Course not found
      </div>
    );
  }

  console.log('selectedVideo:', selectedVideo);
  
  return (
    <div className="container mx-auto mt-20 p-4">
      {isLoading && <p  className='mt-[120px]  justify-center items-center mx-[70px] text-xl'>Loading...</p>}
      {course && (
        <div className="flex flex-col lg:flex-row mt-10 space-y-10 lg:space-y-0 lg:space-x-10">
          <div className="lg:w-3/4 bg-white shadow-lg p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
            <div className="space-y-6">
            {selectedVideo && <PlyrVideo key={selectedVideo} videoId={selectedVideo} />}
            </div>
          </div>
          <div className="lg:w-1/4 bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            {JSON.parse(course.content).units.map((unit: any, unitIndex: number) => (
              <div key={unitIndex} className="mb-4">
                <h3 className="text-xl font-semibold">{`Unit ${unitIndex + 1}: ${unit.title}`}</h3>
                <ul className="list-disc list-inside">
                  {unit.lessons.map((lesson: any, lessonIndex: number) => (
                    <li
                      key={lessonIndex}
                      className="text-gray-700 hover:cursor-pointer"
                      onClick={() => handleLessonSelect(lesson.videoUrl)}
                    >
                      {lesson.title} ({lesson.duration})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyCourse;
