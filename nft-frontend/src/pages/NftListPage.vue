<template>
    <q-page padding>
      <q-card>
        <q-card-section>
          
          <q-btn color="primary" label="Yeni NFT Ekle" @click="openDialog" />
        </q-card-section>
  
        <!-- Filtreleme -->
        <q-card-section>
          <q-form @submit.prevent="applyFilters" class="q-gutter-md">
            <q-select
              v-model="filters.type"
              :options="typeOptions"
              label="Tür"
              emit-value
              map-options
            />
            <q-input v-model.number="filters.minPrice" label="Minimum Fiyat" type="number" />
            <q-input v-model.number="filters.maxPrice" label="Maksimum Fiyat" type="number" />
            <q-btn type="submit" label="Filtrele" color="primary" />
          </q-form>
        </q-card-section>
  
        <!-- NFT Tablosu -->
        <q-card-section>
        <div class="text-h6">NFT Listesi</div><br>
          <q-table
            :rows="nfts.items"
            :columns="columns"
            row-key="title"
            v-model:pagination="pagination"
            :loading="loading"
            :pagination="initialPagination"
            :rows-per-page-options="[5, 10, 25, 50, 100, 0]"
            :filter-method="filterNfts"
            @request="handleRequest"
          />
          <template>
            <q-inner-loading showing color="primary"> </q-inner-loading>
        </template>
        </q-card-section>
      </q-card>
  
      <!-- Medium Dialog ile Yeni NFT Ekleme -->
      <q-dialog v-model="showDialog" >
        <q-card style="min-width: 500px;">
          <q-card-section>
            <div class="text-h6">Yeni NFT Ekle</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="saveNft" class="q-gutter-md">
              <q-input v-model="newNft.title" label="Başlık" />
              <q-input v-model.number="newNft.price" label="Fiyat" type="number" />
              <q-select
                v-model="newNft.type"
                :options="typeOptions"
                label="Tür Seçin"
                emit-value
                map-options
              />
              <q-btn type="submit" label="Satın Al" color="positive" />
            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="İptal" color="negative" @click="showDialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script>
  import { api } from 'src/boot/axios';
  export default {
    data() {
      return {
        nfts: { items: [], total: 0 },
        filters: { type: '', minPrice: null, maxPrice: null },
        newNft: {
          title: '',
          price: null,
          type: '',
        },
        typeOptions: [
          { label: 'Resim', value: 'image' },
          { label: 'Video', value: 'video' },
        ],
        columns: [
        { name: 'title', label: 'Başlık', field: 'title' , align: 'left'},
        { name: 'price', label: 'Fiyat', field: 'price', align: 'left', sortable: true },
        { 
            name: 'type', 
            label: 'Tür', 
            field: 'type', 
            align: 'left',
            format: (val) => {
            const typeOption = this.typeOptions.find(option => option.value === val);
            return typeOption ? typeOption.label : val;
            } 
        },
        { 
            name: 'createdAt', 
            label: 'Eklenme Tarihi', 
            field: 'createdAt', 
            align: 'left',
            format: (val) => this.formatDate(val),
            sortable: true 
        },
        ],
        pagination: { page: 1, rowsPerPage: 10 },
        loading: false,
        showDialog: false,
      };
    },
    methods: {
      async fetchNfts() {
        this.loading = true;
        const { page, rowsPerPage, sortBy, descending } = this.pagination;
        const skip = (page - 1) * rowsPerPage;
        const query = {
          ...this.filters,
          skip,
          limit: rowsPerPage,
          sortBy: sortBy || 'createdAt',
          order: descending ? 'desc' : 'asc',
        };
  
        try {
          const response = await api.get('/nfts', { params: query });
          this.nfts = response.data;
        } catch (err) {
          console.error(err);
        } finally {
          this.loading = false;
        }
      },
      async saveNft() {
        try {
          await api.post('/nfts', this.newNft);
          this.resetForm();
          this.fetchNfts();
          this.showDialog = false;
        } catch (err) {
          console.error(err);
        }
      },
      resetForm() {
        this.newNft = {
          title: '',
          price: null,
          type: '',
        };
      },
      applyFilters() {
        this.pagination.page = 1;
        this.fetchNfts();
      },
      filterNfts(nft) {
        const typeMatch = this.filters.type ? nft.type === this.filters.type : true;
        return typeMatch;
      },
      handleRequest({ pagination }) {
        this.pagination = pagination;
        this.fetchNfts();
      },
      openDialog() {
        this.showDialog = true;
      },
      formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes} - ${day}.${month}.${year} `;
    },
    },
    mounted() {
      this.fetchNfts();
    },
    
  };
  </script>
  