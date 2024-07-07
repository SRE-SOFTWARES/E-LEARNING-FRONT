'use client';

import { useCourseBySlug } from '@/utils/hooks/getCourse';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaRegFaceSadTear } from 'react-icons/fa6';
import dynamic from 'next/dynamic';

import PlyrVideoComponent from '@/components/mediaPlayer/player';
import ReactPlayer from 'react-player'
function MyCourse({ params }: { params: { slug: string } }) {
    const [isOpen, setIsOpen] = useState(false);
  const slug = params.slug;
  const numericId = slug.split('-').pop();

  const { data: course, isLoading, isError } = useCourseBySlug(Number(numericId));
  console.log(course?.content&&JSON.parse(course.content),'con')
  const [selected,setSelected]=useState(course?.content&&JSON.parse(course.content)[0]?.lessons[0]?.videoUrl)
  console.log(selected,'selected')
  console.log(course?.content&&JSON.parse(course.content)[0]?.lessons[0]?.videoUrl,'con')

  return (
    <div className="container mx-auto mt-20 p-4">
      {isLoading && <div>Loading...</div>}
      {isError && (
        <div className='flex justify-center items-center py-20 text-xl'>
          <FaRegFaceSadTear className='mx-5 h-11 w-11' /> Error loading course
        </div>
      )}
      {!course && !isLoading && !isError && (
        <div className='flex justify-center items-center py-20 text-xl'>
          <FaRegFaceSadTear className='mx-5 h-11 w-11' /> Course not found
        </div>
      )}

      
        <div className="flex flex-col lg:flex-row mt-10 space-y-10 lg:space-y-0 lg:space-x-10">
          <div className="lg:w-3/4 bg-white shadow-lg p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-6">{course?.title}</h1>
            <div className="space-y-6">
              
               
            {selected?<PlyrVideoComponent videoId={selected}/>:null}
          
                 
            </div>
          </div>
          {course && (
          <div className="lg:w-1/4 bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            {JSON.parse(course.content).units.map((unit: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold">{`unit-${index+1} `}{unit.title}</h3>
                <ul className="list-disc list-inside">
                 {unit.lessons.map((lesson: any, index: number) => (
                    <li key={index} className="text-gray-700 hover:cursor-pointer" onClick={() => setSelected(lesson.videoUrl)}>{lesson.title} {lesson.duration}</li>
                  ))} 
                  
                </ul>
              </div>
            ))}

          </div>
           )}
        </div>
     
    </div>
  );
}

export default MyCourse;
