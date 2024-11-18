import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'

export const stationService = {
	remove,
	query,
	getById,
	add,
	// update,
}

async function query(filterBy = { txt: '' }) {
	try {
        // const criteria = {
        //     name: { $regex: filterBy.txt, $options: 'i' },
        // }

		const collection = await dbService.getCollection('station')
		var stations = await collection.find().toArray()
		return stations
	} catch (err) {
		logger.error('cannot find station', err)
		throw err
	}
}

async function getById(stationId) {
	try {
		console.log(stationId);
		
		const collection = await dbService.getCollection('station')
		const station = await collection.findOne({ _id: ObjectId.createFromHexString(stationId) })
		return station
	} catch (err) {
		logger.error(`while finding station ${stationId}`, err)
		throw err
	}
}

async function remove(stationId) {
	try {
		const collection = await dbService.getCollection('station')
		const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(stationId) })
        return deletedCount
	} catch (err) {
		logger.error(`cannot remove station ${stationId}`, err)
		throw err
	}
}

async function add(station) {
	try {
		const collection = await dbService.getCollection('station')
		await collection.insertOne(station)
		return station
	} catch (err) {
		logger.error('cannot insert station', err)
		throw err
	}
}

// async function update(station) {
// 	try {
// 		const stationToSave = {
// 			name: toy.name,
// 			price: toy.price,
// 			labels : toy.labels,
// 			createdAt: toy.createdAt,
// 			inStock: toy.inStock
// 		}
// 		const collection = await dbService.getCollection('toy')
// 		await collection.updateOne({ _id: ObjectId.createFromHexString(toy._id) }, { $set: stationToSave })
// 		return toy
// 	} catch (err) {
// 		logger.error(`cannot update toy ${toyId}`, err)
// 		throw err
// 	}
// }

