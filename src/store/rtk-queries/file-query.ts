import { createApi } from '@reduxjs/toolkit/query/react';
import * as uuid from 'uuid';

import baseQuery from './base-query';
import { addFile, updateDownloadingProgress } from '../slices/file-slice';
import { changeUploadProgress, uploadFile } from '../slices/upload-slice';

import axiosInstance from '../../utils/axios';
import { eventSource } from '../../utils/event-source';
import { MB } from '../../utils/config';
import { IFile, ISort } from '../../types/file-types';

const fileAPI = createApi({
	reducerPath: 'fileAPI',
	baseQuery,
	tagTypes: ['fileAPI'],
	endpoints: builder => ({
		createDir: builder.mutation<IFile, { name: string; parent: string | null }>(
			{
				query: body => ({ url: '/file', method: 'POST', body }),
			}
		),
		getFileUrl: builder.mutation<string, string>({
			query: id => ({ url: `/file/get-url?id=${id}` }),
		}),
		deleteFile: builder.mutation<{ id: string; message: string }, string>({
			query: id => ({ url: `/file?id=${id}`, method: 'DELETE' }),
		}),
		getFiles: builder.mutation<IFile[], { dirId: string | null; sort: ISort }>({
			query: ({ dirId, sort }) => {
				let url = `/file?sort=${sort}`;
				if (dirId) {
					url += `&parent=${dirId}`;
				}
				return { url };
			},
		}),
		searchFile: builder.mutation<IFile[], string>({
			query: value => {
				value = value.trim();
				let url = `/file/search?search=${value}`;
				if (value === '') url = '/file?sort=type';
				return { url };
			},
		}),
		downloadFile: builder.mutation<null, { id: string; name: string }>({
			queryFn: async ({ id, name }, api) => {
				let diff = '0';
				const { data } = await axiosInstance<Blob>(`file/download?id=${id}`, {
					responseType: 'blob',
					onDownloadProgress: () => {
						eventSource.addEventListener(
							`download-${name}`,
							({ data }: { data: string }) => {
								if (+data !== +diff) {
									diff = data;
									api.dispatch(
										updateDownloadingProgress({ id, progress: +data })
									);
								}
							}
						);
					},
				});
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(data);
				link.download = name;
				link.click();
				return { data: null };
			},
		}),
		uploadFiles: builder.mutation<
			null,
			{ files: File[]; parent: string | null }
		>({
			queryFn: async ({ files, parent }, api) => {
				files.forEach(async (file: File) => {
					const size = file.size;
					if (size > MB * 10) return alert('File cannot be more than 10 MB.');
					const { data: exists } = await axiosInstance<boolean>(
						`file/exist-check?name=${file.name}${
							parent ? '&parent=' + parent : ''
						}`
					);
					if (exists) {
						return alert('File already exists');
					}
					const id: string = uuid.v1();
					api.dispatch(uploadFile({ id, name: file.name, progress: 0 }));
					const formData = new FormData();
					if (parent) formData.append('parent', parent);
					formData.append('file', file);
					let progressName = `progress-${file.name}`;
					if (parent) {
						progressName += parent;
					}
					const response = await axiosInstance.post<IFile>(
						'file/upload',
						formData,
						{
							onUploadProgress: () => {
								eventSource.addEventListener(
									progressName,
									({ data }: { data: string }) => {
										api.dispatch(changeUploadProgress({ id, progress: +data }));
									}
								);
							},
						}
					);
					api.dispatch(addFile(response.data));
				});
				return { data: null };
			},
		}),
	}),
});

export default fileAPI;
